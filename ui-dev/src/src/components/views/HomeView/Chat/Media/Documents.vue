
<script setup lang="ts">
import { ref } from "vue";
import useStore from "@src/store/store";
import DocumentsList from './DocumentsList.vue'
const store = useStore();
const DocumentsData = ref({})
DocumentsData.value = store.messages.map((e) => e);
const filteredDocFiles = store.messages.filter((e) => e.media_files != null && (e.media_files?.type === 'doc' || (e.media_files.name && e.media_files.name.toLowerCase().endsWith('.avi')) ||e.media_files?.type === 'geographical'));

</script>

<template>
    <DocumentsList :docFiles="filteredDocFiles" />
</template>



