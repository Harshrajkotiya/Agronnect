<script setup lang="ts">
import type { LastMessage } from "@src/types";
import type { Ref } from "vue";
import { onMounted, reactive, ref, watch } from "vue";

import NoArchive from "@src/components/states/empty-states/NoArchive.vue";
import Loading1 from "@src/components/states/loading-states/Loading1.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import ConversationsList from "@src/components/views/HomeView/Sidebar/Conversations/ConversationsList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";
import { postData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
const { postAllData, ArchivedDataMessage } = postData();
const store = useStore();

// determines whether the archive is open or not
const openArchive = ref(false);
const isMatchedConversation = ref(false);
const filteredConversations: Ref<LastMessage[]> = ref([] as LastMessage[]);
const keyword: Ref<string> = ref("");

// filter the list of conversation based on search text.
watch([keyword, filteredConversations], () => {
  if (keyword.value === "") {
    store.listSearchResult = filteredConversations.value;
  } else {
    const filteredMessage =
      filteredConversations.value?.filter((e) =>
        (e.name + " " + e.last_name)
          .toLowerCase()
          .includes(keyword.value.toLowerCase()),
      ) || [];
    if (filteredMessage.length > 0) {
      store.listSearchResult = filteredMessage;
    } else {
      isMatchedConversation.value = true;
      store.listSearchResult = filteredConversations.value;
    }
  }
});

// (event) switch between the rendered conversations.
const handleConversationChange = (
  conversationId: number,
  receiverId: number,
) => {
  store.activeConversationId = conversationId;
  store.activeReceiverId = receiverId;
  store.conversationOpen = "open";

  if (store.activeSidebarComponent === "archived") {
    store.activeUserId = conversationId;
  }
};

const noArchive = ref(false);

async function getArchived() {
  const APIBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const archivedUrl = `${APIBaseUrl}/api/v1/archived-chat-user-list`;
  const archivedData = reactive({
    user_id: store.loginUserList?.id,
    user_type: store.userType,
  });

  await postAllData(archivedUrl, archivedData);
  const ArchivedList = ArchivedDataMessage.value;

  if (ArchivedList?.length === 0) {
    noArchive.value = true;
  } else {
    if (store.userType == "specialist") {
      filteredConversations.value = store.farmer?.filter((item) => {
        const matchedData = ArchivedList?.find(
          (f2Item) =>
            item.id ===
            (store.loginUserList?.id == f2Item.sender_id
              ? f2Item.receiver_id
              : f2Item.sender_id),
        );
        if (matchedData) {
          item["message"] = matchedData.message;
          item["consultation_id"] = matchedData.consultation_id;
          item["date"] = store.chatTime(new Date(matchedData.created_at));

          return item;
        }
      }) as LastMessage[];
      store.archivedConversations = filteredConversations.value;
    } else if (store.userType == "farmer") {
      filteredConversations.value = store.specialist?.map((item) => {
        const matchedData = ArchivedList?.find(
          (f2Item) =>
            item.id ===
            (store.loginUserList?.id == f2Item.sender_id
              ? f2Item.receiver_id
              : f2Item.sender_id),
        );
        if (matchedData) {
          return {
            ...item,
            message: matchedData.message,
            consultation_id: matchedData.consultation_id,
          };
        }
      }) as LastMessage[];
      store.archivedConversations = filteredConversations.value;
    }
  }
}

let conversation = filteredConversations.value;
if (conversation && store.archivedConversations.length != 0) {
  openArchive.value = true;
  store.activeConversationId = store.archivedConversations[0].id;
}

onMounted(() => {
  store.activeConversationId = null;
  getArchived();
});
</script>

<template>
  <div>
    <SidebarHeader />
    <!--search bar-->
    <div
      class="ms-5"
      v-if="(filteredConversations && filteredConversations?.length !== 0) && (store.archivedConversations && store.archivedConversations.length > 0)">
      <SearchInput v-model="keyword" />
    </div>

    <!--conversations-->
    <div
      role="list"
      aria-label="conversations"
      class="w-full h-full scroll-smooth scrollbar-hidden"
      :class="[store.isIOS ? 'h-[55vh] md:h-full' : 'h-[66vh] md:h-full']"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <!-- <Loading1
        v-if="store.status === 'loading' || store.delayLoading"
        v-for="item in 6"
      /> -->
      <div v-if="store.status === 'loading' || store.delayLoading">
        <Loading1 v-for="item in 6" :key="item" />
      </div>

      <div v-else>
        <div
          v-if="
            store.status === 'success' &&
            !store.delayLoading &&
            filteredConversations &&
            filteredConversations.length > 0
          "
        >
          <FadeTransition>
            <component
              :is="ConversationsList"
              :filtered-conversations="
                keyword === '' ? filteredConversations : store.listSearchResult
              "
              :active-id="parseInt(store.activeConversationId?.toString() ?? '0')"
              :active-receiver_id="parseInt(store.activeReceiverId?.toString() ?? '0')"
              :handle-conversation-change="handleConversationChange"
              :key="openArchive ? 'archive' : 'active'"
            />
          </FadeTransition>
        </div>
        <div v-else>
          <div v-if="store.status === 'loading' || store.delayLoading">
            <Loading1 v-for="item in 6" :key="item" />
          </div>
          <NoConversation v-else />
        </div>
        <div v-if="noArchive">
          <NoArchive />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-fill {
  fill: #7b809a;
}

a:focus .custom-fill {
  fill: #00ab89;
}
</style>
