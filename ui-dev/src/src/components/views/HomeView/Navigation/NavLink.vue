<script setup lang="ts">
const props = defineProps<{
  title: string;
  notifications?: number;
  active?: boolean;
}>();
</script>

<template>
  <div class="xs:mb-0 md:mb- lg:my-4">
    <button
      class="group relative focus:outline-none flex "
      :title="props.title"
      :aria-label="
        props.notifications
          ? props.title + ' ' + props.notifications + ' new notifications'
          : props.title
      "
    >

      <!--icon-->
     <p class="lg:text-[0.9rem] xl:text-[1rem] xxl:text-[1.2rem] mx-4"> {{ props.title }}</p>
      <!--notification pill-->
      <div
        v-if="props.notifications"
        class="absolute right-0 top-3 w-5 h-5 flex items-center justify-center outline-none bg-indigo-400 text-xs text-white border border-white rounded-full transition duration-500"
      >
        {{ props.notifications }}
      </div>
    </button>
  </div>
</template>
