<script setup lang="ts">
import type { ChatMessages } from "@src/types";
import { shorten } from "@src/utils";
import { ref } from "vue";

const props = defineProps<{
  message: ChatMessages;
  self?: boolean;
}>();
const screenWidth = ref(window.innerWidth);
const getShortenedMessage = (content: string) => {
  if (screenWidth.value < 600) {
    // Mobile screen
    return shorten(content, 50);
  } else if (screenWidth.value >= 600 && screenWidth.value < 1024) {
    // Laptop screen
    return shorten(content, 150);
  } else {
    // Desktop screen
    return shorten(content, 300);
  }
};
</script>

<template>
  <div
    v-if="props.message"
    class="pl-3 outline-none border-opacity-50 duration-200"
    :class="['border-gray-900']"
    tabindex="0"
  >
    <p
      v-if="props.message.content || props.message?.messageEdited"
      :no-color="true"
      class="text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
    >
      {{
        props.message?.messageEdited
          ? shorten(props.message?.messageEdited, 300)
          : getShortenedMessage(props.message?.content)
      }}
    </p>

    <div v-else-if="props.message?.media_files">
      <div
        v-if="props.message?.media_files?.type === 'image'"
        :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
      >
        <img src="/svg/CameraIcon.svg" alt="Network error" />
        <img
          :src="props.message?.media_files?.thumb_path"
          alt="Network error"
          class="h-[30px] w-[70px] mx-3"
        />
      </div>

      <div
        v-if="
          props.message?.media_files?.type === 'doc' ||
          props.message?.media_files?.type === 'geographical'
        "
        :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
      >
        <img src="/svg/DocumentIcon.svg" alt="Network error" />
        <p class="mx-3">{{ props.message?.media_files?.name }}</p>
      </div>

      <div
        v-if="props.message?.media_files?.type === 'video'"
        :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
      >
        <img
          src="/svg/PlayIcon.svg"
          alt="Play Icon"
          class="cursor-pointer w-[30px]"
        />
        <p class="mx-3">{{ props.message?.media_files?.name }}</p>
      </div>

      <div
        v-if="props.message?.media_files?.type === 'audio'"
        :no-color="true"
        class="flex items-center text-[#ADB5BD] text-[14px] italic rounded-md px-4 py-2"
      >
        <img
          src="/svg/VoiceRecordIcon.svg"
          alt="Play Icon"
          class="cursor-pointer"
        />
        <p class="mx-3">{{ props.message?.media_files?.name }}</p>
      </div>
    </div>
  </div>
</template>
