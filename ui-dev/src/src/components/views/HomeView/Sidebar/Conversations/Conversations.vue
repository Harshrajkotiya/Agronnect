<script setup lang="ts">
import NoConversation from "@src/components/states/empty-states/NoConversation.vue";
import NoMatchedConversation from "@src/components/states/empty-states/NoMatchedConversation.vue";
import Loading1 from "@src/components/states/loading-states/Loading1.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import ConversationsList from "@src/components/views/HomeView/Sidebar/Conversations/ConversationsList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";
import { getData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
import type { ChatMessages, LastMessage, IConversation } from "@src/types";
import type { Ref } from "vue";
import { onMounted, ref, watch, watchEffect } from "vue";
const store = useStore();
const { getUserData } = getData();
const props = defineProps<{
  dataa: ChatMessages;
}>();

const shouldShowNoConversation = ref(false);
const isMatchedConversation = ref(false);
async function fetch() {
  const url = "user";
  await getUserData(url);
}
fetch();

// determines whether the archive is open or not
const openArchive = ref(false);
const keyword: Ref<string> = ref("");

watchEffect(() => {
  getUsersList();
});

function getUsersList() {
  if (store.userType == "specialist") {
    let userIdData = store.farmer?.map((m: IConversation) => {
      const matchingFarmer = store.lastMessage?.find(
        (farmer: LastMessage) =>
          farmer.receiver_id === m.id || farmer.sender === m.id,
      );

      if (matchingFarmer) {
        return matchingFarmer.receiver_id;
      } else {
        return m.sender;
      }
    });

    const filteredFarmers =
      store.lastMessage?.filter(
        (farmer: LastMessage) =>
          userIdData?.includes(farmer.receiver_id || farmer.sender),
      ) || [];

    const mappedFarmers: LastMessage[] = filteredFarmers.map(
      (filteredFarmer: LastMessage) => {
        const matchingFarmer = store.farmer?.find(
          (f: IConversation) =>
            f.id === filteredFarmer.receiver_id ||
            f.id === filteredFarmer.sender,
        );
        return {
          id: filteredFarmer.id,
          name: matchingFarmer?.name,
          last_name: matchingFarmer?.last_name,
          profile_image: matchingFarmer?.profile_image,
          date: filteredFarmer.date,
          message: filteredFarmer.message,
          sender: filteredFarmer.sender,
          receiver_id: filteredFarmer.receiver_id,
          consultation_id: filteredFarmer.consultation_id,
          isMuted: filteredFarmer.isMuted,
          mutedDuration: filteredFarmer.mutedDuration,
          mutedTime: filteredFarmer.mutedTime,
          unread_message_count: filteredFarmer.unread_message_count ?? 0,
        };
      },
    );
    store.lastMessage = mappedFarmers;
  } else if (store.userType == "farmer") {
    let userIdData = store.specialist?.map((specialist: IConversation) => {
      const matchingFarmer = store.lastMessage?.find(
        (lastMessage: LastMessage) =>
          lastMessage.receiver_id === specialist.id ||
          lastMessage.sender === specialist.id,
      );

      if (matchingFarmer) {
        return matchingFarmer.receiver_id;
      } else {
        return specialist.sender;
      }
    });

    const filteredFarmers =
      store.lastMessage?.filter(
        (lastMessage: LastMessage) =>
          userIdData?.includes(lastMessage.receiver_id || lastMessage.sender),
      ) || [];

    const mappedFarmers: LastMessage[] = filteredFarmers.map(
      (filteredFarmer: LastMessage) => {
        const matchingFarmer = store.specialist?.find(
          (f: IConversation) =>
            f.id === filteredFarmer.receiver_id ||
            f.id === filteredFarmer.sender,
        );

        return {
          id: filteredFarmer.id,
          name: matchingFarmer?.name,
          last_name: matchingFarmer?.last_name,
          profile_image: matchingFarmer?.profile_image,
          date: filteredFarmer.date,
          message: filteredFarmer.message,
          sender: filteredFarmer.sender,
          receiver_id: filteredFarmer.receiver_id,
          consultation_id: filteredFarmer.consultation_id,
          isMuted: filteredFarmer.isMuted,
          mutedDuration: filteredFarmer.mutedDuration,
          mutedTime: filteredFarmer.mutedTime,
          unread_message_count: filteredFarmer.unread_message_count ?? 0,
        };
      },
    );
    store.lastMessage = mappedFarmers;
  }
}

// filter the list of conversation based on search text.
watch([keyword, store.lastMessage], () => {
  if (keyword.value === "") {
    store.listSearchResult = store.lastMessage;
    isMatchedConversation.value = true;
  } else {

if(store.isUnreadFilterActive) {
  const filteredMessage =
      store.filteredUnreadChats?.filter((e) =>
        (e.name + " " + e.last_name)
          .toLowerCase()
          .includes(keyword.value.toLowerCase()),
      ) || [];
    if (filteredMessage.length > 0) {
      isMatchedConversation.value = true;
      store.listSearchResult = filteredMessage;
    } else {
      isMatchedConversation.value = false;
      store.listSearchResult = store.filteredUnreadChats;
    }
}

else {

    const filteredMessage =
      store.lastMessage?.filter((e) =>
        (e.name + " " + e.last_name)
          .toLowerCase()
          .includes(keyword.value.toLowerCase()),
      ) || [];
    if (filteredMessage.length > 0) {
      isMatchedConversation.value = true;
      store.listSearchResult = filteredMessage;
    } else {
      isMatchedConversation.value = false;
      store.listSearchResult = store.lastMessage;
    }
  }


  }
});

if (store.archivedConversations.length != 0) {
  const filteredArchiveData = store.lastMessage?.filter((conv) =>
    store.archivedConversations.some(
      (archiveConv) => archiveConv?.consultation_id != conv.consultation_id,
    ),
  );
  store.lastMessage = filteredArchiveData;
}

let conversation = store.archivedConversations.find(
  (conversation) => conversation.id === store.activeConversationId,
);
if (conversation) {
  store.activeConversationId = store.lastMessage?.[0]?.consultation_id;
}
const handleConversationChange = (conversationId: number) => {
  store.openAttachmentBar = false;
  store.media = false;
  store.inputSearch = "";
  store.activeConversationId = conversationId;
  store.conversationOpen = "open";
  store.checkselectMessages = false;
  store.selectedMessages = [];
  store.messages = [];
  
  const matched = !!store.lastMessage.find(
    (e) => e.consultation_id === store.activeConversationId && e.isMuted === 1,
  );

  if (matched) {
    store.isMute = true;
  } else {
    store.isMute = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    if (store.lastMessage.length === 0) {
      shouldShowNoConversation.value = true;
    }
  }, 20000);
});


const handleUnreadChatFilter = ()=>{
store.isUnreadFilterActive = true;
store.filteredUnreadChats =  store.lastMessage?.filter((e: LastMessage)=> e.unread_message_count ?? 0 > 0)

}

const handleCancelUnreadChatFilter =()=>{
  store.isUnreadFilterActive = false;
  store.filteredUnreadChats = [];
}

</script>

<template>
 
    <div>
    <SidebarHeader />

    <div class="ms-5"  v-if="store.lastMessage.length > 0">
    <SearchInput v-model="keyword" :handleUnreadFilter="handleUnreadChatFilter" :handleCancelBtn="handleCancelUnreadChatFilter"/>
    </div>

    <!--conversations-->
    <div
      role="list"
      aria-label="conversations"
      class="w-full scroll-smooth scrollbar-hidden"
      :class="[store.isIOS ? 'h-[55vh] md:h-full' : 'h-[66vh] md:h-full']"
      style="overflow-x: visible; overflow-y: scroll"
    >
      <Loading1
        v-if="
          store.status === 'loading' ||
          store.delayLoading || store.isChatLoading === false
    
        "
        v-for="item in 6"
      />

      <div v-else-if="store.isChatLoading === true">

        <div
          v-if="
            isMatchedConversation === false &&
            store.listSearchResult?.length > 0 &&
            keyword.length > 0
          " >
          <NoMatchedConversation />
        </div>

        <div v-else-if="store.filteredUnreadChats?.length === 0 && store.isUnreadFilterActive === true">
          <NoMatchedConversation />
        </div>

        <div v-else-if="shouldShowNoConversation">
          <NoConversation />
        </div>

        <div v-else>
          <FadeTransition>
            <component 
              :is="ConversationsList"
              :filtered-conversations="
              keyword === '' ? (store.isUnreadFilterActive  ? store.filteredUnreadChats : store.lastMessage) : store.listSearchResult 
              "
              :active-id="store.activeConversationId as number"
              :key="openArchive ? 'archive' : 'active'"
              :handle-conversation-change="handleConversationChange"
            />
          </FadeTransition>
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
