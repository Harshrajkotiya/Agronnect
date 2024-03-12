<script setup lang="ts">
import useStore from "@src/store/store";
import type { IConversation } from "@src/types";
import type { Ref } from "vue";
import { onMounted, ref } from "vue";

const store = useStore();
const openArchive = ref(false);

// the filtered list of conversations.
const filteredConversations: Ref<IConversation[]> = ref(store.conversations);

const handleActiveMedia = () => {
  store.media = true;
  store.attachmentlinks = false;
  store.attachmentdocuments = false;
};
const handleActiveLinks = () => {
  store.attachmentlinks = true;
  store.media = false;
  store.attachmentdocuments = false;
};
const handleActiveDocument = () => {
  store.attachmentdocuments = true;
  store.attachmentlinks = false;
  store.media = false;
};
const props = defineProps(["Media", "Links", "Documents"]);

onMounted(() => {
  let conversation = store.archivedConversations.find(
    (conversation) => conversation.id === store.activeConversationId,
  );

  if (conversation) openArchive.value = true;
});

const closeAttachmentBar = () =>{
  store.openAttachmentBar = false
  store.media = false
  store.attachmentdocuments = false;
  store.attachmentlinks = false;
}
</script>

<template>
  <div class="md:flex md:bg-[#F8F9FA] py-6 px-5 font-medium flex justify-between hidden">
    <div>
      <p class="font-bold font-600 text-[18px]">Attachments</p>
    </div>
    <div class="">
      <img
        src="/svg/CrossIcon.svg"
        alt="Network Error"
        class="cursor-pointer"
        @click="closeAttachmentBar()"
      />
    </div>
  </div>

  <div class="md:flex md:justify-end w-full">
    <div
      class="w-full max-h-fit flex justify-between items-center bg-[#FAF7F5] mb-3 text-[#7B809A] text-[1rem] shadow-md md:relative md:items-end"
    >
      <div
        class="cursor-pointer hover:bg-[#E9F3EB] w-[33.33%] text-center py-6"
        tabindex="0"
        :class="{
          'text-[#00AB89] bg-[#E9F3EB] font-bold': store.media === true,
        }"
        @click="() => handleActiveMedia()"
      >
        <p>{{ Media }}</p>
      </div>

      <div
        class="cursor-pointer hover:bg-[#E9F3EB] text-center py-6 w-[33.33%]"
        :class="{
          'text-[#00AB89] bg-[#E9F3EB] font-bold': store.attachmentlinks === true,
        }"
        tabindex="0"
        @click="() => handleActiveLinks()"
      >
        <p>{{ Links }}</p>
      </div>

      <div
        class="cursor-pointer hover:bg-[#E9F3EB] text-center py-6 custom-fill w-[33.33%]"
        :class="{
          'text-[#00AB89] bg-[#E9F3EB] font-bold': store.attachmentdocuments === true,
        }"
        tabindex="0"
        @click="handleActiveDocument()"
      >
        <p>{{ Documents }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stylingTitle {
color: #343A40;
font-family: Roboto;
font-size: 16px;
font-style: bold;
font-weight: 600;
line-height: normal;
}
</style>
