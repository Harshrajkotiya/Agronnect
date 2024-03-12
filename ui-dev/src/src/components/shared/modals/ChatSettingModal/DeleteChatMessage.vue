<script setup lang="ts">
import Modal from "@src/components/ui/utils/Modal.vue";
import { ChatMessages } from "@src/types";
import DeleteModalContent from "./DeleteModalContent.vue";

const props = defineProps<{
  open: boolean;
  closeModal: (endCall: boolean) => void;
  closeDropdown?: () => void;
  message?: ChatMessages | undefined | ChatMessages[];
  handleCloseSelect?: () => void;
}>();

const handleCloseModal=()=>{
  props.closeModal(true);
  if (props.closeDropdown) {
  props.closeDropdown();
}
}

</script>

<template>
  <Modal :open="props.open" :close-modal="() => props.closeModal(false)" class="text-left">
    <template v-slot:content>

      <DeleteModalContent title="Delete Message ?" cancelbtn="Cancel" submitbtn="Delete" :handleCloseModal="handleCloseModal" :message="message"  :handle-close-select="props.handleCloseSelect"/>
    </template>
  </Modal>
</template>

<style scoped>


</style>