<script setup lang="ts">
import useStore from "@src/store/store";
import type { ChatMessages } from "@src/types";
import { shorten } from "@src/utils";
import { nextTick } from "vue";

const store = useStore();

const props = defineProps<{
  message: ChatMessages;
  self?: boolean;
  id?: string;
  selected?: boolean;
}>();

const replyedMessage = store.messages.find((Message: ChatMessages) => Message.id == props.message.replyMessageId);

function handleScroll(replyedMessage: ChatMessages) {
  nextTick(() => {
    const element = document.getElementById(`messageContainer-${replyedMessage.id}`);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
}
</script>

<template>
  <div v-if="replyedMessage" class="pl-3 outline-none border-opacity-50 duration-200 cursor-pointer"
    :class="['border-gray-900']" tabindex="0"
    @click="handleScroll(replyedMessage)">

    <p v-if="replyedMessage.content" :no-color="true" class="text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
      :class="{ 'bg-[#FFEDDD]': props.self && !props.selected , 'bg-[#F8F9FA]': !props.self && !props.selected , 'bg-[#00AB8966]': props.selected  }">
      {{ shorten(replyedMessage?.content, 130)  }}
    </p>

    <div v-else-if="replyedMessage.media_files">
      <div v-if="replyedMessage.media_files?.type === 'image'" :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
        :class="self ? 'bg-[#FFEDDD]' : 'bg-[#F8F9FA]'">
        <img src="/svg/CameraIcon.svg" alt="Network error" />
        <img :src="replyedMessage.media_files?.thumb_path" alt="Network error" class="h-[30px] w-[70px] mx-3" />
      </div>

      <div v-if="replyedMessage?.media_files?.type === 'doc'" :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
        :class="self ? 'bg-[#FFEDDD]' : 'bg-[#F8F9FA]'">
        <img src="/svg/DocumentIcon.svg" alt="Network error" />
        <p class="mx-3">{{ replyedMessage?.media_files?.name }}</p>
      </div>


      <div v-if="replyedMessage?.media_files?.type === 'video'" :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
        :class="self ? 'bg-[#FFEDDD]' : 'bg-[#F8F9FA]'">
        <img src="/svg/PlayIcon.svg" alt="Play Icon" class="cursor-pointer w-[30px]">
        <p class="mx-3">{{ replyedMessage?.media_files?.name }}</p>
      </div>

      <div v-if="replyedMessage?.media_files?.type === 'audio'" :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
        :class="self ? 'bg-[#FFEDDD]' : 'bg-[#F8F9FA]'">
        <img src="/svg/VoiceRecordIcon.svg" alt="Play Icon" class="cursor-pointer ">
        <p class="mx-3">{{ replyedMessage?.media_files?.name }}</p>
      </div>
    </div>
  </div>
</template>
