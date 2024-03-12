
<script setup lang="ts">
import useStore from '@src/store/store';
const store= useStore();

const props= defineProps(['singleMessage'])
</script>

<template>
  <div class="flex justify-end">
{{ store.singleMsg?.emoji }} 
  </div>
</template>

