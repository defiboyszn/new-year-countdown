import { defineComponent, h } from "vue";
const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOURS = 60 * MILLISECONDS_MINUTE;
const MILLISECONDS_DAYS = 24 * MILLISECONDS_HOURS;
const $abort = "abort";
const $end = "end";
const $progress = "progress";
const $start = "start";
const $visibility_change = "visibilitychange";
export default defineComponent({
    name: "CountDown",
    props: {
        autoStart: { 
            type: Boolean,
            default: true,
        },
        emitEvents: {
            type: Boolean,
            default: true,
        },
        interval: {
            type: Number,
            default: 1000,
            validator: (value) => value >= 0,
        },
        now: {
            type: Function,
            default: () => Date.now(),
        },
        tag: {
            type: String,
            default: "span",
        },
        time: {
            type: Number,
            default: 0,
            validator: (value) => value >= 0,
        },
        transform: {
            type: Function,
            default: (props) => props,
        },
    },
    emits: [$abort, $end, $progress, $start],
    data: () => ({
        counting: false,
        endTime: 0,
        totalMilliseconds: 0,
        requestid: 0,
    }),
    computed: {
        days() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_DAYS);
        },
        hours() {
            return Math.floor(
                (this.totalMilliseconds % MILLISECONDS_DAYS) / MILLISECONDS_HOURS
            );
        },
        minutes() {
            return Math.floor(
                (this.totalMilliseconds % MILLISECONDS_HOURS) / MILLISECONDS_MINUTE
            );
        },
        seconds() {
            return Math.floor(
                (this.totalMilliseconds % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND
            );
        },
        milliseconds() {
            return Math.floor(this.totalMilliseconds % MILLISECONDS_SECOND);
        },
        totalDays() {
            return this.days;
        },
        totalHours() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_HOURS);
        },
        totalMinutes() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_MINUTE);
        },
        totalSeconds() {
            return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
        },
    },
    watch: {
        $props: {
            deep: true,
            immediate: true,
            handler() {
                this.totalMilliseconds = this.time;
                this.endTime = this.now() + this.time;
                if (this.autoStart) {
                    this.start();
                }
            },
        },
    },
    mounted() {
        if (this.days === 0){
            alert("Happy New Year")
        }
        // document.addEventListener('readystatechange', () => {
        //     setInterval(() => {
        //         this.update();
        //         this.continue();
        //     }, 1000)
        //     this.handleVisible()
        // });
        setInterval(() => {
            this.update();
            this.continue();
            this
        }, 1000)
    },
    beforeUnmount() {
        document.removeEventListener($visibility_change, this.handleVisible);
        this.pause();
    },
    methods: {
        start() {
            if (this.counting) {
                return;
            }
            this.counting = true;
            if (this.emitEvents) {
                this.$emit($start);
            }
            if (document.visibilityState === "visible") {
                this.continue();
            }
        },
        continue() {
            if (this.counting) {
                return;
            }
            const delay = Math.min(this.totalMilliseconds, this.interval);
            if (delay > 0) {
                let init;
                let prev;
                const step = (now) => {
                    if (!init) {
                        init = now;
                    }
                    if (!prev) {
                        prev = now;
                    }
                    const range = now - init;
                    if (range >= delay || range + (now - prev) / 2 >= delay) {
                        this.progress();
                    } else {
                        this.requestid = requestAnimationFrame(step);
                    }
                    prev = now;
                };
                this.requestid = requestAnimationFrame(step);
            } else {
                this.end();
            }
        },
        pause() {
            cancelAnimationFrame(this.requestid);
        },
        progress() {
            if (this.counting) {
                return;
            }
            this.totalMilliseconds -= this.interval;

            if (this.emitEvents && this.totalMilliseconds > 0) {
                this.$emit($progress, {
                    days: this.days,
                    hours: this.hours,
                    minutes: this.minutes,
                    seconds: this.seconds,
                    milliseconds: this.milliseconds,
                    totalDays: this.totalDays,
                    totalHours: this.totalHours,
                    totalMinutes: this.totalMinutes,
                    totalSeconds: this.totalSeconds,
                    totalMilliseconds: this.totalMilliseconds,
                });
            }
            this.continue();
        },
        abort() {
            if (this.counting) {
                return;
            }
            this.pause();
            this.counting = false;
            if (this.emitEvents) {
                this.$emit($abort);
            }
        },
        end() {
            if (this.counting) {
                return;
            }
            this.pause();
            this.totalMilliseconds = 0;
            this.counting = false;
            if (this.emitEvents) {
                this.$emit($end);
            }
        },
        update() {
            if (this.counting) {
                this.totalMilliseconds = Math.max(0, this.endTime - this.now());
            }
        },
        handleVisible() {
            switch (document.visibilityState) {
                case "visible":
                    this.update();
                    this.continue();
                    break;
                case "hidden":
                    this.pause();
                    break;
                default:
            }
        },
    },
    render() {
        return h(
            this.tag,
            this.$slots.default
                ? this.$slots.default(
                    this.transform({
                        days: this.days,
                        hours: this.hours,
                        minutes: this.minutes,
                        seconds: this.seconds,
                        milliseconds: this.milliseconds,
                        totalDays: this.totalDays,
                        totalHours: this.totalHours,
                        totalMinutes: this.totalMinutes,
                        totalSeconds: this.totalSeconds,
                        totalMilliseconds: this.totalMilliseconds,
                    })
                )
                : undefined
        );
    },
});