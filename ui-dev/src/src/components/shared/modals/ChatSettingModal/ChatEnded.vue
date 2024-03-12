<script setup lang="ts">
import { ref,computed } from "vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import ModalContent from "./ModalContent.vue";
import useStore from "@src/store/store";

const store = useStore();
const props = defineProps<{
  open: boolean;
  closeModal: (endCall: boolean) => void;
}>();

const handleCloseModal=()=>{
  props.closeModal(true);
  if(!store.showTextbox){
    store.showTextbox = false;
  }
}

const formattedSubtitle = computed(()=>{
const subtitle= ref(`You're about to end this chat. This means:\n`);
return subtitle.value;
});

const optionsData= computed(()=> {
    return `<li>You won't be able to send or receive messages in this chat anymore. </li> <li>The consultation will be considered completed.</li>`
})

const bottomTitle=ref("Please ensure you've addressed all concerns and provided necessary guidance before ending the chat. If you're ready, click 'Confirm' to proceed.")
</script>

<template>
  <Modal :open="props.open" :close-modal="() => props.closeModal(false)">
    <template v-slot:content>
      
   <ModalContent title="End Chat Confirmation" :subtitle="formattedSubtitle" cancelbtn="Cancel" submitbtn="Confirm" :handleCloseModal="handleCloseModal" :optionsData="optionsData" :bottomTitle="bottomTitle"/>
    </template>
  </Modal>

</template>

<style>
.endChatListMarker li::marker {
    color: #00AB89;
    font-size: 24px;
}
</style>