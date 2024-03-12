<script setup lang="ts">
import { postData } from '@src/composable/fetchData';
import useStore from "@src/store/store";
import { ChatMessages } from "@src/types";
import { reactive } from 'vue';
const store = useStore();
const props = defineProps<{
  title: String,
  cancelbtn: String,
  submitbtn: String,
  handleCloseModal: Function,
  message: ChatMessages[] | undefined | ChatMessages ,
  handleCloseSelect?: () => void;
}>();

const { postAllData, ArchivedDataMessage } = postData();
const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const DeleteMsgUrl = `${ApiBaseUrl}/api/v1/delete-message`;

const handleClose = () => {
  props.handleCloseModal();
}
async function handleDelete() {
  store.messageContainer = null;
  if (Array.isArray(props.message)) {
    const messageIds = props.message?.map(item => item.id);
    const deleteData = reactive({ message_id: messageIds, consultation_id: store.activeConversationId });
    await postAllData(DeleteMsgUrl, deleteData);

    if (ArchivedDataMessage.value) {
      messageIds?.forEach((id) => {
        const index = store.messages?.findIndex((e) => e.id === id);
        if (index !== -1) {
          store.messages[index].content = "The message has been removed";
          // Set media_files to empty values
          store.messages[index].media_files = {
            type: '',
            path: '',
            thumb_path: '',
            name: '',
            size: '',
            id: 0,
            duration: '',
            isMediaDelete: true
          };
        }
        else {
          console.log("Error, message not found in the store.messages array for ID:", id);
        }
      });

      props.handleCloseSelect && props.handleCloseSelect();
      store.checkselectMessages = false;
    }
  }


  else if (typeof props.message === 'object') {
    const messageArray = [props.message?.id];
    const deleteData = reactive({ message_id: messageArray, consultation_id: store.activeConversationId });
    await postAllData(DeleteMsgUrl, deleteData);

    if (ArchivedDataMessage.value) {
      const messageId = props.message?.id;
      if (messageId !== undefined) {

        const a = store.messages?.findIndex((e) => e.id === messageId);

        if (a !== -1) {
          store.isDelete = true;
          store.checkselectMessages = false
          if (props.handleCloseSelect) {
            props.handleCloseSelect();
          }
          store.messages[a].content = "The message has been removed";
          store.messages[a].messageEdited = "The message has been removed";
        }
        else {
          console.log("Message not found in the store.");
        }
        props.handleCloseModal();
      }
    }
  }
}
</script>

<template>
  <div class="absolute bg-white rounded-lg shadow-xl px-6 z-9999 lg:w-[25%] py-9 center ">
    <p>Delete Message ?</p>

    <div class="mt-5 flex justify-end hover:cursor-pointer">
      <button type="button"
        class="border border-gray-400 text-black uppercase rounded-lg px-6 py-1 mx-4 cursor-pointer text-[14px] focus:outline-none focus:ring-0"
        @click="handleClose()">Cancel</button>
      <button type="button" class="border bg-[#00AB89] text-white uppercase rounded-lg px-6 py-3 text-[14px] focus:border-0 focus:outline-none focus:ring-0"
        style="cursor: pointer;" @click="handleDelete">Delete</button>
    </div>
  </div>
</template>