<script setup lang="ts">
import { computed } from "vue";
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  handleClick?: () => void;
  label?: string;
  color?: string;
}>();

const baseClasses = `w-full py-3 my-3 flex items-center px-5 
`;

const colorClasses = computed(() => {
  if (props.color === "success") {
    return "text-[#198754]";
  } else {
    return `text-[#7B809A]`;
  }
});

const classes = twMerge(baseClasses, colorClasses.value);
</script>

<template>
  <button
    :aria-label="props.label"
    @click.prevent="props.handleClick"
    :class="classes"
    role="menuitem"
  >
    <slot></slot>
  </button>
</template>
