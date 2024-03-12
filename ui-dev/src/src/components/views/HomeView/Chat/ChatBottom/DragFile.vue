<template>
  <div class="bg-red-500" 
    @dragover="dragover" 
    @dragleave="dragleave" 
    @drop="drop"
  >
    <input 
      type="file" 
      multiple 
      name="file" 
      id="fileInput" 
      class="hidden-input" 
      @change="onChange" 
      accept=".pdf,.jpg,.jpeg,.png" 
      ref="fileInputRef" 
    />
    <label for="fileInput" class="file-label">
      <div v-if="isDragging">Release to drop files here.</div>
      <div v-else>Drop files here or <u>click here</u> to upload.</div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDragging = ref(false);
const files = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

const onChange = () => {
  if (fileInputRef.value?.files) {
    files.value.push(...Array.from(fileInputRef.value.files));
  }
};

const dragover = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const dragleave = () => {
  isDragging.value = false;
};

const drop = (e: DragEvent) => {
  e.preventDefault();
  if (fileInputRef.value) {
    fileInputRef.value.files = e.dataTransfer?.files || null;
    onChange();
    isDragging.value = false;
  }
};

onMounted(() => {
  fileInputRef.value = document.getElementById('fileInput') as HTMLInputElement;
});
</script>
