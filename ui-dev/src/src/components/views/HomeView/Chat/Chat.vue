<script setup lang="ts">
import type { Ref } from "vue";
import { computed, provide, ref } from "vue";
import useStore from "@src/store/store";
import ProfileSection from "./ProfileSection.vue";
import ChatBottom from "@src/components/views/HomeView/Chat/ChatBottom/ChatBottom.vue";
import ChatMiddle from "@src/components/views/HomeView/Chat/ChatMiddle/ChatMiddle.vue";
import ChatTop from "@src/components/views/HomeView/Chat/ChatTop/ChatTop.vue";
import type {
  ChatMessages,
  IConversation,
  IMessage,
  LastMessage,
} from "@src/types";
const store = useStore();
const selectedData = ref<ChatMessages[]>([]);

// search the selected conversation using activeConversationId.
const activeConversation = computed(() => {
  let activeConversation = store.conversations.find(
    (conversation: IConversation) => conversation.id === 1,
  );

  if (activeConversation) {
    return activeConversation;
  } else {
    return store.archivedConversations.find(
      (conversation: LastMessage) =>
        conversation.id === store.activeConversationId,
    );
  }
});

const activeUser = computed(() => {
  if (store.userType === "farmer") {
    let activeUser = store.conversations.find(
      (conversation) => conversation.id === store.activeUserId,
    );

    if (activeUser) {
      return activeUser;
    } else {
      return store.archivedConversations.find(
        (conversation) => conversation.id === store.activeUserId,
      );
    }
  }

  if (store.userType === "specialist") {
    let activeUser = store.conversations.find(
      (conversation) => conversation.id === store.activeSpecialistId,
    );

    if (activeUser) {
      return activeUser;
    } else {
      return store.archivedConversations.find(
        (conversation) => conversation.id === store.activeSpecialistId,
      );
    }
  }
});
// provide the active conversation to all children.
provide("activeConversation", activeConversation.value);

// determines whether select mode is enabled.
const selectMode = ref(false);

// determines whether all the messages are selected or not.
const selectAll = ref(false);

// holds the selected conversations.
const selectedMessages: Ref<number[]> = ref([]);

const handleSelectMessage = (messageId: number | null) => {
  if (messageId) {
    store.selectedMessages.push(messageId);
  }

  if (
    activeConversation.value &&
    store.selectedMessages.length === activeConversation.value?.messages?.length
  ) {
    selectAll.value = true;
  }

  if (!selectMode.value) {
    selectMode.value = true;
  }

  selectedData.value = store.messages.filter((e) =>
  store.selectedMessages?.includes(e.id),
  );
};
const handleDeselectMessage = (messageId: number) => {
  selectAll.value = false;
  store.selectedMessages = store.selectedMessages.filter(
    (item) => item !== messageId,
  );
  if (activeConversation.value && store.selectedMessages.length < 0) {
    selectMode.value = false;
  }
};

// (event) select all messages.
const handleSelectAll = () => {
  if (activeConversation.value) {
    const messages = activeConversation.value?.messages?.map(
      (message: IMessage) => message.id,
    );
    selectAll.value = true;
  }
};

// (event) remove the selected messages.
const handleDeselectAll = () => {
  selectAll.value = false;
  store.selectedMessages = [];
};

// (event handle close Select)
const handleCloseSelect = () => {
  selectMode.value = false;
  selectAll.value = false;
  store.selectedMessages = [];
};

const handleBack = () => {
  store.isViewProfile = false;
  store.messages = [];
};

</script>
<template>
  <div v-if="activeConversation" class="h-full flex flex-col scrollbar-hidden">
    <ChatTop
      v-if="store.isViewProfile == false"
      :select-all="selectAll"
      :select-mode="selectMode"
      :handle-select-all="handleSelectAll"
      :handle-deselect-all="handleDeselectAll"
      :handle-close-select="handleCloseSelect"
      :handle-select-message="handleSelectMessage"
      :selected-messages="store.selectedMessages"
      :selected-data="selectedData"
    />
    <ChatMiddle
      v-if="store.isViewProfile == false"
      :selected-messages="store.selectedMessages"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
    />
    <ChatBottom
      v-if="!store.isViewProfile"
      :handle-close-select="handleCloseSelect"
    />

    <!-- Farmer & Specialist profile -->
    <div v-if="store.isViewProfile == true">
      <div
        ref="container"
        class="px-5 py-5 h-[100vh] overflow-auto text-[#7B809A]"
        style="
          background: #fffcf9 url(/svg/chatMiddleIMG.svg);
          background-size: cover;
          background-repeat: no-repeat;
          position: relative;
        "
      >
        <div class="mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="cursor-pointer"
            @click="handleBack()"
          >
            <path
              d="M20 11V13H8L13.5 18.5L12.08 19.92L4.16 12L12.08 4.08002L13.5 5.50002L8 11H20Z"
              fill="#6B7C85"
            />
          </svg>
        </div>

        <ProfileSection :activeConversation="activeUser" />
      </div>
    </div>
  </div>
</template>
