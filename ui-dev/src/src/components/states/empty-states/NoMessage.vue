<script setup lang="ts">
import { ChatBubbleOvalLeftIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  vertical?: boolean;
}>();
</script>

<template>
  <div
    class="w-full flex items-center justify-center h-[800px]"
    :class="
      props.vertical
        ? ['flex-col', 'justify-center', 'items-center']
        : ['flex-row']
    "
  >
    <!--icon-->
    <div :class="props.vertical ? ['mb-3'] : []">
      <div
        class="w-7 h-7 mr-4 flex justify-center items-center rounded-full bg-gray-50 transition duration-500"
      >
        <ChatBubbleOvalLeftIcon class="text-gray-500"
        />
      </div>
    </div>

    <!--content-->
    <div :class="props.vertical ? [] : ['flex', 'flex-col', 'items-center']" class="grid items-center ">
      <p class="mb-3 text-3xl flex justify-center ">No Messages</p>

      <p class="flex justify-center text-[18px]">
        Send a message to start conversation
      </p>
    </div>
  </div>
</template>
