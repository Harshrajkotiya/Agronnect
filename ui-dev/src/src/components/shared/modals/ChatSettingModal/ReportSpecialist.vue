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
const subtitle= ref(`If you believe that the specialist's behavior or content violates our terms and conditions, please select one or more options below to help us understand the issue better.\n Your input is invaluable in maintaining a positive and respectful environment for all users.`);
return subtitle.value;
});

</script>

<template>
  <Modal :open="props.open" :close-modal="() => props.closeModal(false)">
    <template v-slot:content>
      
   <ModalContent title="Report Specialist" :subtitle="formattedSubtitle" cancelbtn="Cancel" submitbtn="Submit Report" :handleCloseModal="handleCloseModal" />
    </template>
  </Modal>

</template>

