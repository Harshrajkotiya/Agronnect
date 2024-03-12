<script setup lang="ts">
import { ChatBubbleOvalLeftIcon } from "@heroicons/vue/24/solid";
import Typography from "@src/components/ui/data-display/Typography.vue";
</script>

<template>
  <div
    class="h-full flex flex-col justify-center items-center hidden md:flex"
    style="
      background: #fffcf9 url(/svg/chatMiddleIMG.svg);
      background-size: cover;
      background-repeat: no-repeat;
    "
  >
    <div
      class="w-10 h-10 mr-4 mb-5 flex justify-center items-center rounded-full bg-gray-50 transition duration-500"
    >
      <ChatBubbleOvalLeftIcon
        class="w-7 h-7 text-gray-400 "
      />
    </div>

    <Typography variant="heading-2" class="mb-3"> No chat selected </Typography>

    <Typography variant="body-2" class="flex">
      Select a conversation from the conversation menu.
    </Typography>
  </div>
</template>
