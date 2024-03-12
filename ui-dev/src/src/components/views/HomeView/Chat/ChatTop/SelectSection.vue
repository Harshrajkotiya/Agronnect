<script setup lang="ts">
import DeleteChatMessage from "@src/components/shared/modals/ChatSettingModal/DeleteChatMessage.vue";
import useStore from "@src/store/store";
import { ChatMessages } from "@src/types";
import { ref } from "vue";
import { POSITION, useToast } from "vue-toastification";

const toast = useToast();
const store = useStore();
const selectedSingleMessage = ref<ChatMessages[] | null>(null);
const openDeleteModal = ref(false);
const props = defineProps<{
  selectMode: boolean;
  selectAll: boolean;
  handleCloseSelect: () => void;
  handleDeselectAll: () => void;
  handleSelectAll: () => void;
  selectedMessages: number[];
  handleSelectMessage: (messageId: number | null) => void;
  selectedData: ChatMessages[];
}>();

const isEditShow = ref(false);
const handleCopy = async () => {
  try {
    // Close the select and set store.checkselectMessages to false
    props.handleCloseSelect();
    store.checkselectMessages = false;
 
    selectedSingleMessage.value = store.messages?.filter(
      (e: ChatMessages) => props.selectedMessages.includes(e.id)
    );
 
    const textToCopy =
      selectedSingleMessage.value.length > 0
        ? selectedSingleMessage.value[0]?.messageEdited ||
          selectedSingleMessage.value[0]?.content
        : null;
 
    if (textToCopy) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for browsers that do not support navigator.clipboard
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
 
      showSuccess();
      console.log("Text copied to clipboard");
    }
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};

function showSuccess() {
  toast.success("Message Copied!", {
    timeout: 1500,
    position: POSITION.TOP_CENTER,
    hideProgressBar: true,
    closeButton: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
}

// Delete
function handleDelete() {
  selectedSingleMessage.value = store.messages?.filter((e) =>
    props.selectedMessages.includes(e.id),
  );
  openDeleteModal.value = true;
}

// Edit
function handleEdit() {
  selectedSingleMessage.value = store.messages?.filter((e) =>
    props.selectedMessages.includes(e.id),
  );
  store.inputValue = selectedSingleMessage.value[0].messageEdited
    ? selectedSingleMessage.value[0]?.messageEdited
    : selectedSingleMessage.value[0]?.content;
  if (!store.isEdit) {
    store.isEdit = true;
  } else {
    store.isEdit = false;
  }

  if (store?.loginUserList?.id === selectedSingleMessage.value[0]?.sender_id) {
    isEditShow.value = true;
    store.singleMsg = selectedSingleMessage.value[0];
    store.isEdit = true;
  }
}
</script>

<template>
  <!--select mode controls-->
  <div v-if="props.selectMode" class="w-full flex items-center justify-between">
    <div class="flex gap-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" @click="() => {
          props.handleCloseSelect(), (store.checkselectMessages = false);
        }
        ">
        <path
          d="M19.9999 11.0001V13.0001H7.99991L13.4999 18.5001L12.0799 19.9201L4.15991 12.0001L12.0799 4.08008L13.4999 5.50008L7.99991 11.0001H19.9999Z"
          fill="#6B7C85" />
      </svg>
      {{ selectedMessages.length }}
    </div>
    <div class="flex gap-6">
      <div v-if="selectedMessages.length === 1 && selectedData[0]?.media_files == null" @click="handleCopy">
        <img src="/svg/CopyIcon.svg" alt="Network error" class="cursor-pointer" />
      </div>
      <div v-if="selectedMessages.length >= 1" @click="handleDelete">
        <img src="/svg/DeleteIcon.svg" alt="Network error" class="cursor-pointer" />
      </div>
    
      <div v-if="selectedMessages.length === 1 && selectedData[0]?.media_files == null " @click="handleEdit">
        <img src="/svg/EditIcon.svg" alt="Network error" class="cursor-pointer" />
      </div>
  
    </div>
  </div>

  <DeleteChatMessage :open="openDeleteModal" :close-modal="() => (openDeleteModal = false)"
    :message="selectedSingleMessage ? selectedSingleMessage : undefined" :handle-close-select="props.handleCloseSelect" />
</template>
