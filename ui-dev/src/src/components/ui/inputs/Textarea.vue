<script setup lang="ts">
import type { Ref } from "vue";
import useStore from "@src/store/store";
import { twMerge } from "tailwind-merge";
import { computed, ref } from "vue";

const store=useStore();
const props = defineProps<{
  class?: any;
  variant?: string;
  value?: string;
  autoResize?: boolean;
  emojis?: string;
}>();
const emit = defineEmits();
const textarea: Ref<HTMLTextAreaElement | null> = ref(null);

const baseClasses = `max-w-full w-full px-5 py-4 rounded-sm content-center outline-none text-sm
        placeholder:text-[#7B809A]
       focus:outline-none transition duration-200 
        ease-out text-black focus:border-0 focus:ring-0`;

const variantClasses = computed(() => {
  if (props.variant === "bordered") {
    return `border border-gray-200 text-black bg-white
           focus:bg-opacity-0
            focus:border-indigo-300 `;
  } else {
    return `text-black bg-white border-0
            `;
  }
});

const classes = twMerge(baseClasses, variantClasses.value, props.class);

const handleAutoResize = () => {
  if (props.autoResize && textarea.value) {
    textarea.value.style.height = "5vh";
    textarea.value.style.height = textarea.value.scrollHeight + "px";
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) { 
    if (textarea.value) {
      textarea.value.style.height = "6vh";
      emit("sendMessage");
    }
  }
};
</script>

<template>

  <textarea
    :class="classes"
    ref="textarea"
    :value="props.value"
    @input="$event =>{handleAutoResize(); $emit('update:modelValue', ($event.target as HTMLInputElement).value)}"
    @keydown="handleKeyDown"
  ></textarea>

</template>
