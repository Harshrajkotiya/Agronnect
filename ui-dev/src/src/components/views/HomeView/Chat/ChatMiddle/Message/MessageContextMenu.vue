<script setup lang="ts">
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import DeleteChatMessage from "@src/components/shared/modals/ChatSettingModal/DeleteChatMessage.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";
import useStore from "@src/store/store";
import type { ChatMessages, IConversation } from "@src/types";
import { inject, ref } from "vue";
import { POSITION, useToast } from "vue-toastification";

const toast = useToast();

const openDeleteModal = ref(false);
const props = defineProps<{
  message?: ChatMessages | ChatMessages[];
  show: boolean;
  left?: number;
  top?: number;
  selected: boolean;
  isSelf?: boolean;
  showContextMenu?: boolean;
  handleCloseContextMenu: () => void;
  handleSelectMessage?: (messageId: number) => void;
  handleDeselectMessage?: (messageId: number) => void;
}>();

const store = useStore();
const activeConversation = <IConversation>inject("activeConversation");

async function handleEdit() {
  if (!Array.isArray(props.message)) {
    if (props.message?.messageEdited) {
      store.inputValue = props.message?.messageEdited;
      props.handleCloseContextMenu();
      store.singleMsg = props.message;
      store.isEdit = true;
    }

    if (
      props.message &&
      props.message?.content &&
      !props.message?.messageEdited
    ) {
      store.inputValue = props.message?.content;
      props.handleCloseContextMenu();
      store.singleMsg = props.message;
      store.isEdit = true;
    }
  }
}

function handleReply() {
  props.handleCloseContextMenu();
  if (Array.isArray(props.message)) {
    props.message.forEach((msg) => {
      store.singleMsg = msg;
      store.isReply = true;
    });
  } else {
    store.singleMsg = props.message;
    store.isReply = true;
  }
}
async function handleCopy() {
  try {
    const textToCopy =
      !Array.isArray(props.message) &&
      (props.message?.messageEdited || props.message?.content);

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
}

async function handleDelete() {
  openDeleteModal.value = true;
}

function showSuccess() {
  props.handleCloseContextMenu();
  toast.success("Message Copied!", {
    timeout: 1500,
    position: POSITION.TOP_CENTER,
    hideProgressBar: true,
    closeButton: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
}
</script>

<template>
  <Dropdown
    v-if="openDeleteModal === false"
    :close-dropdown="handleCloseContextMenu"
    :handle-click-outside="handleCloseContextMenu"
    :show="show"
    :isSelf="props.isSelf"
    :coordinates="{
      left: props.left + 'px',
      top: props.top + 'px',
    }"
    :position="['top-0']"
  >
    <DropdownLink
      color="danger"
      class="flex items-center focus:outline-none"
      v-if="
        props.isSelf &&
        store.activeSidebarComponent != 'archived' &&
        !Array.isArray(props.message) &&
        props.message?.media_files === null
      "
      @click="handleEdit()"
    >
      <img src="/svg/EditIcon.svg" alt="Network error" />
      <p class="mx-5">Edit</p>
    </DropdownLink>

    <DropdownLink
      @click="handleCopy"
      v-if="
        !Array.isArray(props.message) && props.message?.media_files === null
      "
      class="flex items-center focus:outline-none"
    >
      <img src="/svg/CopyIcon.svg" alt="Network error" />
      <p class="mx-5">Copy</p>
    </DropdownLink>

    <DropdownLink
      @click="handleDelete"
      color="danger"
      class="flex items-center focus:outline-none"
      v-if="props.isSelf"
    >
      <img src="/svg/DeleteIcon.svg" alt="Network error" />
      <p class="mx-5">Delete</p>
    </DropdownLink>

    <DropdownLink
      v-if="
        store.activeSidebarComponent !== 'archived' ||
        !Array.isArray(props.message) ||
        (Array.isArray(props.message) &&
          props.message.every(
            (msg) =>
              Array.isArray(msg.media_files) && msg.media_files.length <= 4,
          ))
      "
      @click="handleReply"
      class="flex items-center focus:outline-none"
    >
      <ArrowUturnLeftIcon class="h-5 w-5 mr-6" />
      Reply
    </DropdownLink>
  </Dropdown>

  <DeleteChatMessage
    v-else
    :open="openDeleteModal"
    :close-modal="() => (openDeleteModal = false)"
    :close-dropdown="handleCloseContextMenu"
    :message="message"
  />
</template>
