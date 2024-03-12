

<script setup lang="ts">
import { ref } from "vue";
import useStore from "@src/store/store";
import LinksList from './LinksList.vue'
const store = useStore();
const LinksData = ref({})
LinksData.value = store.messages.map((e) => e);

// Filtering messages starting with 'http' or 'https'
const filteredLinkFiles = store.messages.filter(message => {
  const content = (message.content || '').toLowerCase();
  return content.startsWith('http') || content.startsWith('https');
});


</script>

<template>
    <LinksList :linkFiles="filteredLinkFiles" />
</template>





