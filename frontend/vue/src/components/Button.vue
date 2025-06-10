<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Button",
  setup: (props) => {
    const classesBasedOnDisabled = props.disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer text-amber-500 hover:border-amber-300 hover:text-amber-300";
    const classes = ` border-1 rounded-md px-4 border-amber-200 ${classesBasedOnDisabled} ${props.class || ""}`

    return {
      disabled: props.disabled,
      classes,
    };
  }
});
</script>

<template>
  <button :disabled="disabled" :class="classes">
    <slot></slot>
  </button>
</template>