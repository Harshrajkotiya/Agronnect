<script setup lang="ts">
import NoCalls from "@src/components/states/empty-states/NoCalls.vue";
import Loading1 from "@src/components/states/loading-states/Loading1.vue";
import ExpandTransition from "@src/components/ui/transitions/ExpandTransition.vue";
import Call from "@src/components/views/HomeView/Sidebar/Calls/Call.vue";
import CallList from "@src/components/views/HomeView/Sidebar/Calls/CallList.vue";
import SidebarHeader from "@src/components/views/HomeView/Sidebar/SidebarHeader.vue";
import useStore from "@src/store/store";
import type { ICall } from "@src/types";
import { Ref, ref } from "vue";

const store = useStore();
const selectedCall: Ref<ICall | null> = ref(null);
const openInfoModal = ref(false);
const handleOpenInfoModal = (call: ICall) => {
  openInfoModal.value = true;
  selectedCall.value = call;
};
</script>

<template>
  <div>
    <!-- <SidebarHeader>
     
      <template v-slot:title>Voice Calls</template>

     
      <template v-slot:actions>
        <IconButton @click="openDialModal = true" class="w-7 h-7" title="initiate call" aria-label="initiate call">
          <PlusCircleIcon class="w-[20px] h-[20px] text-indigo-300 hover:text-indigo-400" />
        </IconButton>
      </template>
    </SidebarHeader> -->

    <SidebarHeader />
    <!--content-->
    <div ref="contactContainer" class="w-full h-full scroll-smooth scrollbar-hidden"
      style="overflow-x: visible; overflow-y: scroll">
      <Loading1 v-if="store.status === 'loading' || store.delayLoading" v-for="item in 6" />

      <div v-else>
        <ExpandTransition>
          <div class="max-h-[200px]" v-if="store.callMinimized && store.activeCall">
            <Call v-if="store.activeCall" :call="store.activeCall"
              :open-voice-call-modal="() => (store.openVoiceCall = true)" :end-call="() => {
                  store.activeCall = undefined;
                  store.callMinimized = false;
                }
                " active />
          </div>
        </ExpandTransition>

        <CallList v-if="(store.calls as ICall[])?.length > 0" :calls="store.calls as ICall[]"
          delay-loading="chat.delayLoading" :chat-status="store.status" :open-info-modal="handleOpenInfoModal" />

        <NoCalls v-else />
      </div>
    </div>

    
  </div>
</template>
