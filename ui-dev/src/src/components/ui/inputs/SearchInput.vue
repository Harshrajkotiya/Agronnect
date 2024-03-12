<script setup lang="ts">
import type { Ref } from "vue";

import { twMerge } from "tailwind-merge";
import { computed, ref } from "vue";

import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import useStore from "@src/store/store";

const props = defineProps<{
  variant?: string;
  class?: string;
  handleUnreadFilter?: () => void;
  handleCancelBtn?: () => void;
  
}>();

const input: Ref<HTMLInputElement | null> = ref(null);
const store= useStore();

const baseClasses = `w-full h-8 py-3 pl-7 border outline-none rounded-sm text-black
placeholder:text-black placeholder:opacity-40 focus:outline-none 
focus:ring focus:ring-indigo-100 duration-200 transition ease-out
text-opacity-70`;

const variantClasses = computed(() => {
  if (props.variant === "outline") {
    return "bg-transparent border-gray-100 focus:outline-none";
  } else {
    return "border-none bg-[#F8F9FA] focus:ring-0";
  }
});
const handleViewCancel = ref(false);

const handleUnreadChatFilter = ()=>{
  if(props.handleUnreadFilter){
    props.handleUnreadFilter();
    handleViewCancel.value = true;

  }
}
const handleCancelBtn =()=>{
  if(props.handleCancelBtn){
    props.handleCancelBtn();
    handleViewCancel.value = false;
  }
}
const classes = twMerge(baseClasses, variantClasses.value, props.class);
</script>

<template>
  <div class="relative">
    <i class="absolute top-[10.5px] text-center left-[10px] right-[10px] w-[10px]">
      <MagnifyingGlassIcon
        class="w-5 h-5 stroke-2 text-black opacity-40"
      />
    </i>
    <div class="flex gap-5">
      <input
        ref="input"
        type="text"
        placeholder="Search or start new chat"
        :class="classes"
        @input="
          ($event) => {
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value,
            );
          }
        "
      />

      <div class="flex items-center">
        <img v-if="handleViewCancel" data-v-d64d2696="" src="/svg/CrossIcon.svg" alt="Cancel Button" class="cursor-pointer mr-2" @click="handleCancelBtn">
        <svg v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none" class="cursor-pointer" @click="handleUnreadChatFilter()"
        >
          <path
            d="M6 13H18V11H6M3 6V8H21V6M10 18H14V16H10V18Z"
            fill="#7B809A"
          />
        </svg>


      </div>
    </div>
    <hr class="mt-5" />
    <div class="absolute top-0 right-0">
      <slot name="endAdornment">
        <IconButton
          v-if="input && input.value"
          @click="
            ($event) => {
              if (input) input.value = '';
              $emit('update:modelValue', '');
            }
          "
          title="clear text"
          aria-label="clear text"
          class="m-[8px] p-2"
        >
       
        </IconButton>
      </slot>
    </div>
  </div>
</template>
