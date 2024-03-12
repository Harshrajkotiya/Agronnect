<script setup lang="ts">
import { ref,computed } from "vue";
import Modal from "@src/components/ui/utils/Modal.vue";
import ModalContent from "./ModalContent.vue";

const props = defineProps<{
  open: boolean;
  closeModal: (endCall: boolean) => void;
}>();

const handleCloseModal=()=>{
  props.closeModal(true);
}
const formattedSubtitle = computed(()=>{
const subtitle= ref(`Muting the chat will prevent further notifications and updates from this chat. \n You can always unmute the chat later if needed.`);
return subtitle.value;
});
</script>

<template>
  <Modal :open="props.open" :close-modal="() => props.closeModal(false)">
    <template v-slot:content>

      <ModalContent title="Mute Notifications" :subtitle="formattedSubtitle" cancelbtn="Cancel" submitbtn="Mute" :handleCloseModal="handleCloseModal"/>
    </template>
  </Modal>
</template>

<style scoped>


</style>