<script setup lang="ts">
import NoChatSelected from "@src/components/states/empty-states/NoChatSelected.vue";
import Loading3 from "@src/components/states/loading-states/Loading3.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import Chat from "@src/components/views/HomeView/Chat/Chat.vue";
import Calls from "@src/components/views/HomeView/Sidebar/Calls/Calls.vue";
import Archieved from "@src/components/views/HomeView/Sidebar/Conversations/ArchievedConversations.vue";
import Conversations from "@src/components/views/HomeView/Sidebar/Conversations/Conversations.vue";
import useStore from "@src/store/store";
import { computed } from "vue";

const store = useStore();
// the selected sidebar component (e.g message/notifications/settings)
const ActiveComponent = computed((): any => {
  if (store.activeSidebarComponent === "messages") {
    return Conversations;
  } else if (store.activeSidebarComponent === "contacts") {
    return;
  } else if (store.activeSidebarComponent === "notifications") {
    return;
  } else if (store.activeSidebarComponent === "phone") {
    return Calls;
  } else if (store.activeSidebarComponent === "settings") {
    return;
  } else if (store.activeSidebarComponent === "archived") {
    return Archieved;
  }
});

// the active chat component or loading component.
const activeChatComponent = computed((props): any => {
  if (store.status === "loading" && store.delayLoading) {
    return Loading3;
  } else if (store.activeConversationId) {
    return Chat;
  } else {
    return NoChatSelected;
  }
});

</script>

<template>
  <aside
    class="xs:w-full md:w-[290px] h-full xs:px-5 md:p-0 flex flex-col overflow-visible transition-all duration-500 xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden"
  >
    <FadeTransition>
      <component
        :is="ActiveComponent"
        :dataa="store.messages"
        class="h-full flex flex-col"
      />
    </FadeTransition>
  </aside>
  <div v-if="
      store.activeSidebarComponent === 'messages' ||
      store.activeSidebarComponent === 'phone' ||
      store.activeSidebarComponent === 'archived'
    "
   
    id="mainContent"
    class="xs:z-10 xs:absolute md:static grow xs:w-full h-full md:w-fit scrollbar-hidden bg-white transition-all duration-500"
    :class="
      store.conversationOpen === 'open'
        ? ['xs:left-[0px]', 'xs:static']
        : ['xs:left-[1000px]']
    "
    role="region"
  >
    <FadeTransition name="fade" mode="out-in">
      <component :is="activeChatComponent" :key="store.activeConversationId" />
    </FadeTransition>
  </div>
</template>
