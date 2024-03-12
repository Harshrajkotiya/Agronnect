<script setup lang="ts">
import { ref } from "vue";
import EmojiReaction from "@src/components/EmojiReaction.vue";
const props = defineProps<{
  show?: boolean;
  closePanel?: () => void;
  handleCloseEmojiPanel: () => void;
}>();
// selected emoji groups
const activeTab = ref("people");

// search keyword
const keyword = ref("");
const showEmojiPanel = ref(true);
</script>

<template>
  <div
    v-if="props.show"
    class="w-[300px] p-6 rounded-full border shadow-xl shadow-outline bg-white border-gray-200 "
  >
    <!--Emojis-->
    <EmojiReaction
      v-if="showEmojiPanel"
      :keyword="keyword"
      :active-tab="activeTab"
      class="w-full"
      :handleCloseEmojiPanel="handleCloseEmojiPanel"
    />
  </div>
</template>
