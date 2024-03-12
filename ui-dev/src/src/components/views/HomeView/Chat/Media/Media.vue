<script setup lang="ts">
import { ref } from "vue";
import useStore from "@src/store/store";
import MediaGallery from './MediaGallery.vue'
const store = useStore();
const MediaData = ref({})
MediaData.value = store.messages.map((e) => e);

const filteredMediaFiles = store.messages.filter((e) => e.media_files != null && (e.media_files?.type === 'image' || (e.media_files?.name && e.media_files?.name.endsWith('.webp') || e.media_files?.type === 'video')));

</script>

<template>
    <MediaGallery :mediaFiles="filteredMediaFiles" />
</template>

