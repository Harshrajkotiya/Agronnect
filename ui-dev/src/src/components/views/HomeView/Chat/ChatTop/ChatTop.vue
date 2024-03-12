<script setup lang="ts">
import type { ChatMessages, IConversation } from "@src/types";
import useStore from "@src/store/store";
import { inject, ref } from "vue";
import ConversationInfoModal from "@src/components/shared/modals/ConversationInfoModal/ConversationInfoModal.vue";
import SearchModal from "@src/components/shared/modals/SearchModal/SearchModal.vue";
import VoiceCallModal from "@src/components/shared/modals/VoiceCallModal/VoiceCallModal.vue";
import PinnedMessage from "@src/components/views/HomeView/Chat/ChatTop/PinnedMessage.vue";
import ConversationInfoSection from "./ConversationInfoSection.vue";
import SelectSection from "./SelectSection.vue";

const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleCloseSelect: () => void;
  handleSelectMessage: (messageId: number | null) => void;
  selectedMessages: number[];
  selectedData: ChatMessages[];
}>();

const store = useStore();
const activeConversation = <IConversation>inject("activeConversation");

const openSearch = ref(false);

const openInfo = ref(false);

// (event) open search modal
const handleOpenSearch = () => {
  openSearch.value = true;
};

// (event) open info modal
const handleOpenInfo = () => {
  openInfo.value = true;
};

// (event) close the voice call modal and minimize the call
const handleCloseVoiceCallModal = (endCall: boolean) => {
  if (endCall) {
    store.activeCall = undefined;
    store.callMinimized = false;
  }

  if (store.openVoiceCall) {
    store.openVoiceCall = false;
    store.callMinimized = true;
  }
};
</script>

<template>
  <div class="w-full">
    <!--Top section-->
    <div class="w-full min-h-[70px] px-5 py-3 bg-[#F8F9FA] flex justify-center">
    
      <SelectSection
        v-if="props.selectMode"
        :select-mode="props.selectMode"
        :select-all="props.selectAll"
        :handle-close-select="props.handleCloseSelect"
        :handle-select-all="props.handleSelectAll"
        :handle-deselect-all="props.handleDeselectAll"
        :selected-messages="selectedMessages"
        :handle-select-message="handleSelectMessage"
        :selected-data="props.selectedData"
      />
      <ConversationInfoSection
        v-else
        :handle-open-info="handleOpenInfo"
        :handle-open-search="handleOpenSearch"
        :handle-select-message="handleSelectMessage"
        :selected-messages="selectedMessages"
      />
    </div>

    <div
      class="relative transition-[padding] duration-200"
      :class="{
        'pb-[60px]':
          activeConversation.pinnedMessage &&
          !activeConversation.pinnedMessageHidden,
      }"
    >
      <PinnedMessage :active-conversation="activeConversation" />
    </div>

    <SearchModal
      :open="openSearch"
      :close-modal="() => (openSearch = false)"
      :conversation="activeConversation"
    />

    <ConversationInfoModal
      :open="openInfo"
      :closeModal="() => (openInfo = false)"
      :conversation="activeConversation"
    />

    <VoiceCallModal
      :open="store.openVoiceCall"
      :close-modal="handleCloseVoiceCallModal"
    />
  </div>
</template>
