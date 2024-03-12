<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { computed } from "vue";

import Typography from "@src/components/ui/data-display/Typography.vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  loading?: boolean;
  variant?: string;
  color?: string;
  link?: boolean;
  class?: string;
  typography?: string;
}>();

// base style
const baseClasses = `group p-3 flex justify-center items-center rounded-sm 
transition-all duration-200 ease-out outline-none`;

// determine the classes of the component
const variantClasses = computed(() => {
  // outline buttons.
  if (props.variant === "outlined") {
    if (props.color === "success") {
      return {
        button: `bg-opacity-0 border border-gray-100 hover:border-green-300
                hover:bg-green-300
               active:ring
                active:ring-green-100 focus:ring focus:ring-green-100 focus:bg-green-300`,
        typography: "button-2",
      };
    } else if (props.color === "danger") {
      return {
        button: `group py-2 px-4
                focus:outline-none focus:border-red-100 
                focus:bg-red-100 hover:bg-red-100 hover:border-red-100
                transition-all
                duration-200 outline-none`,
        typography: "button-2",
      };
    } else {
      return {
        button: `bg-opacity-0 border border-gray-100 hover:border-indigo-300 
                hover:bg-indigo-300
                 active:ring 
                active:ring-indigo-100 focus:ring focus:ring-indigo-100 focus:bg-indigo-300`,
        typography: "button-2",
      };
    }
  }

  // ghost buttons.
  else if (props.variant === "ghost") {
    if (props.color === "success") {
      return {
        button: `hover:bg-green-50 hover:text-green-400 active:bg-green-100 
                `,
        typography: "button-3",
      };
    } else if (props.color === "danger") {
      return {
        button: `hover:bg-red-50 active:bg-red-100 focus:outline-none focus:ring-0
                `,
        typography: "button-4",
      };
    } else {
      return {
        button: `hover:bg-indigo-50 hover:text-indigo-400 active:bg-indigo-100 
                `,
        typography: "button-3",
      };
    }
  }

  // contained buttons.
  else {
    if (props.color === "success") {
      return {
        button: `bg-green-300 active:ring 
                active:ring-green-200 focus:outline-none focus:ring focus:ring-green-100`,
        typography: "button-1",
      };
    } else if (props.color === "danger") {
      return {
        button: `bg-red-300 active:ring active:ring-red-200',
                focus:outline-none focus:ring focus:ring-red-100`,
        typography: `button-1`,
      };
    } else {
      return {
        button: `bg-indigo-300 active:ring active:ring-indigo-200',
                focus:outline-none focus:ring focus:ring-indigo-100`,
        typography: "button-1",
      };
    }
  }
});

// merge the button classes with base classes.
const classes = twMerge(baseClasses, variantClasses.value.button, props.class);
</script>

<template>
  <component
    :is="link ? RouterLink : 'button'"
    @click="$emit('button-clicked', $event)"
    tabindex="0"
    :class="classes"
  >
    <!--loading icon-->
    <svg
      v-if="props.loading"
      :class="{ 'animate-spin': props.loading }"
      class="-ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 01412H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!--text-->
    <Typography
      v-if="props.loading"
      :variant="props.typography || variantClasses.typography"
    >
      Processing
    </Typography>

    <!--text-->
    <Typography v-else :variant="props.typography || variantClasses.typography">
      <slot></slot>
    </Typography>
  </component>
</template>
