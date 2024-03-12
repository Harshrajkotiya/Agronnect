<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

const props = defineProps<{
  variant?: string;
  emojiReaction?: string;
}>();

let baseClasses = `group flex justify-center items-center
    outline-none rounded-full focus:outline-none focus:ring-0 transition-all
    duration-200`;

const variantClasses = computed(() => {
  if (props.variant === "ghost") {
    return "";
  } else {
    return "focus:bg-gray-50 hover:bg-gray-50";
  }
});

const classes = twMerge(baseClasses, variantClasses.value);
</script>

<template>

  <button :class="classes">
    <slot></slot>
  </button>
</template>
