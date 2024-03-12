<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

const props = defineProps<{
  variant?: string;
  noColor?: boolean;
  class?: any;
  customStyle?: string;
}>();

const style = computed(() => {
  // heading texts
  if (props.variant && props.variant.includes("heading")) {
    if (props.variant === "heading-1") {
      return props.noColor
        ? "text-xl leading-4 tracking-[0.16px]"
        : "text-black text-xl leading-4 tracking-[0.16px]";
    }

    if (props.variant === "heading-2") {
      return props.noColor
        ? "outline-none text-[16px] leading-4 tracking-[0.16px] font-normal"
        : "outline-none text-black text-[16px] font-semibold leading-4 tracking-[0.16px] font-normal ";

    }

    if (props.variant === "heading-3") {
      return props.noColor
        ? "outline-none text-xs font-semibold leading-4 tracking-[0.16px]"
        : "outline-none text-xs text-black font-semibold leading-4 tracking-[0.16px]";
    }

    if (props.variant === "heading-4") {
      return props.noColor
        ? "outline-none text-3xl leading-9 tracking-[0.16px]"
        : "outline-none text-3xl text-black leading-9 tracking-[0.16px]";
    }
  
  }

  // body texts
  else if (props.variant && props.variant.includes("body")) {
    if (props.variant === "body-1") {
      return props.noColor
        ? "outline-none text-xs font-light leading-4 tracking-[0.16px]"
        : "outline-none text-xs text-black font-light leading-4 tracking-[0.16px] b1";
    } else if (props.variant === "body-2") {
      return props.noColor
        ? "outline-none text-[13px] text-[#7B809A] font-normal leading-4 tracking-[0.16px] text-center cursor-text selectable-text"
        : "outline-none text-[13px] text-[#7B809A] font-normal leading-4 tracking-[0.16px] text-center";

    } else if (props.variant === "body-3") {
      return props.noColor
        ? "outline-none text-sm font-light leading-5 tracking-[0.16px]"
        : "outline-none text-sm font-light text-black leading-5 tracking-[0.16px] b3";
    } else if (props.variant === "body-4") {
      return props.noColor
        ? " text-xs font-light leading-4 tracking-[0.16px]"
        : " text-xs font-light text-black leading-4 tracking-[0.16px] b4";
    } else if (props.variant === "body-5") {
      return props.noColor
        ? "outline-none text-[16px] font-light leading-4 tracking-[0.16px]"
        : "outline-none text-[16px] font-light text-black leading-4 tracking-[0.16px] b5";
    }
  }

  // display texts
  else if (props.variant && props.variant === "display") {
    return props.noColor
      ? "outline-none font-display text-[28px] leading-[34px] tracking-[0px]"
      : "outline-none font-display text-[28px] text-black leading-[34px] tracking-[0px]";
  }

  // buttons texts
  else if (props.variant && props.variant?.includes("button")) {
    if (props.variant === "button-1") {
      return props.noColor
        ? "text-sm font-semibold leading-4 tracking-[0.16px]"
        : "text-sm font-semibold text-white leading-4 tracking-[0.16px]";
    } else if (props.variant === "button-2") {
      return props.noColor
        ? "text-sm leading-4 tracking-[0.16px] font-semibold"
        : `text-sm leading-4 tracking-[0.16px] font-semibold group-hover:text-white group-hover:opacity-100
                group-focus:text-white group-focus:opacity-100 `;
    } else if (props.variant === "button-3") {
      return props.noColor
        ? "text-sm leading-4 tracking-[0.16px]"
        : "text-sm leading-4 tracking-[0.16px] text-black";
    } else if (props.variant === "button-4") {
      return props.noColor
        ? "text-sm leading-4 tracking-[0.16px]"
        : "text-sm leading-4 tracking-[0.16px] text-red-400";
    }
  }

  // default to body-1
  else {
    return props.noColor
      ? "outline-none text-xs font-light leading-4 tracking-[0.16px]"
      : "outline-none text-xs text-black font-light leading-4 tracking-[0.16px]";
  }
});

const textStyle = twMerge(style.value, props.customStyle, props.class);
</script>

<template>
  <p :class="textStyle">
    <slot></slot>
  </p>
</template>

<style scoped>
.selectable-text {
  user-select: text; 
}
</style>
