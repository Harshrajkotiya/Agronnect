<script setup lang="ts">

import type { LastMessage } from "@src/types";
import Conversation from "./Conversation.vue";
import useStore from "@src/store/store";
const props = defineProps<{
  handleConversationChange: (conversationId: number, receiver_id: number) => void;
  filteredConversations?: LastMessage[];
  activeId?: number;
}>();
const store= useStore();

</script>

<template>
  <Conversation v-for="conversation in props.filteredConversations" :conversation="conversation"
  :is-active="activeId === conversation.consultation_id" :key="conversation.id" role="listitem"
    :userId="store.loginUserList?.id == conversation.sender ? conversation.receiver_id : conversation.sender"  :handle-conversation-change="props.handleConversationChange"/>
</template>
