<script setup lang="ts">
import { ref } from 'vue';

const isAccordionOpen = ref(false);

const toggleAccordion = () => {
  isAccordionOpen.value = !isAccordionOpen.value;
};

const props = defineProps(['title']);
</script>

<template>
  <div class="accordion">
    <div class="flex justify-between mt-6 text-[16px] font-bold text-[#344767]" @click="toggleAccordion">
      <p>{{ title }}</p>
      <i :class="!isAccordionOpen ? 'fa-solid fa-angle-down' : 'fa-solid fa-angle-up'"></i>
    </div>
    <div class="mt-4" :class="title == 'Crops' ? 'min-[320px]:grid grid-cols-2 min-[215px]:block' : ''" v-show="isAccordionOpen">
      <slot></slot>
    </div>
  </div>
</template>
  
  
  
 