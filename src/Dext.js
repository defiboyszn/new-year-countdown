import { defineComponent, h } from "vue";
import { RouterView,RouterLink } from 'vue-router'


export var Dext = defineComponent({
    name: 'Dext',
    setup(){
        return ()=> h(RouterView)
    }
})



export var Link = defineComponent({
    name: 'Link',
    setup(props, { slots }){
        // const { to,replace } = toRefs(props)
        return ()=> h(RouterLink, {
             to: props.to,
             replace: props.replace,
             ...props,
        },slots.default)
    }
})