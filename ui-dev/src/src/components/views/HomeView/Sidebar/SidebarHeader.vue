<script setup lang="ts">
import useStore from "@src/store/store";

const store = useStore();

// const filteredConversations: Ref<LastMessage[]> = ref(store.lastMessage);
const handleActiveSidebarComponentChange = (value: string) => {
  store.activeSidebarComponent = value;
  store.activeConversationId = null;
};

</script>

<template>
  <div

    class="w-full max-h-fit min-h-[70px] flex justify-between items-center bg-[#FAF7F5] mb-3 text-[#7B809A] text-[0.8rem]">
    <div class="cursor-pointer hover:bg-[#E9F3EB] w-[33.33%] text-center py-4 hover:rounded-r-full font-bold" :class="{
      'text-[#00AB89] bg-[#E9F3EB] rounded-r-full':
        store.activeSidebarComponent === 'messages',
    }" tabindex="0" @click="() => handleActiveSidebarComponentChange('messages')">
      <div v-if="store.activeSidebarComponent === 'messages'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="mx-auto">
          <path
            d="M17 12V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V17L6 13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12ZM21 6H19V15H6V17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18H18L22 22V7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6Z"
            fill="#00AB89" />
        </svg>
      </div>
      <div v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="mx-auto">
          <path
            d="M15 4V11H5.17L4 12.17V4H15ZM16 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V17L6 13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2ZM21 6H19V15H6V17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18H18L22 22V7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6Z"
            fill="#7B809A" />
        </svg>
      </div>
      <p>Chats</p>
    </div>

    <div class="cursor-pointer hover:bg-[#E9F3EB] w-[33.33%] text-center py-4 hover:rounded-full font-bold" :class="{
      'text-[#00AB89] bg-[#E9F3EB] rounded-full':
        store.activeSidebarComponent === 'phone',
    }" tabindex="0" @click="() => handleActiveSidebarComponentChange('phone')">
      <img v-if="store.activeSidebarComponent === 'phone'" src="/svg/CallGreen.svg" class="mx-auto focus:scale-110"
        alt="Network Error" />
      <img v-else src="/svg/Call.svg" class="mx-auto focus:scale-110" alt="Network Error" />
      <p>Call</p>
    </div>

    <div class="cursor-pointer hover:bg-[#E9F3EB] w-[33.33%] text-center py-4 hover:rounded-l-full font-bold custom-fill"
      :class="{
        'text-[#00AB89] bg-[#E9F3EB] rounded-l-full':
          store.activeSidebarComponent === 'archived',
      }" tabindex="0" @click="handleActiveSidebarComponentChange('archived')">
     
      <img v-if="store.activeSidebarComponent === 'archived'" src="/svg/ArchiveGreen.svg" style="text-align: center"
        class="mx-auto custom-fill" alt="Network Error" />
      <img v-else src="/svg/Archive.svg" class="mx-auto focus:scale-110"
        alt="Network Error" />
     
      <p>Archive</p>
    </div>
  </div>
</template>
