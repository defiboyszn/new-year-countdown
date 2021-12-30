<template>
  <div class="text-gray-500">
    <h1
      class="
        text-8xl
        font-bold
        mb-5
        bg-gradient-to-t bg-clip-text
        text-transparent
        from-red-400
        to-yellow-500
      "
    >
      New Year CountDown
    </h1>
    <Counter
      :time="time"
      :interval="100"
      v-slot="{ days, hours, minutes, seconds }"
    >
      <p class="text-3xl">
        {{ days }} days, {{ hours }} hours, {{ minutes }} minutes,
        {{ seconds }} seconds.
      </p>
    </Counter>
  </div>
</template>

<script>
import Counter from "@/components/Counter";

export default {
  data() {
    const now = new Date();
    const newYear = new Date(now.getFullYear() + 1, 0, 1);
    const time = newYear - now;
    return {
      time,
    };
  },
  components: {
    Counter,
  },
};
</script>

