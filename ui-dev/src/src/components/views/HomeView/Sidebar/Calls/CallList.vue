<script setup lang="ts">
import type { ICall, CallList } from "@src/types";
import Call from "@src/components/views/HomeView/Sidebar/Calls/Call.vue";
import SearchInput from "@src/components/ui/inputs/SearchInput.vue";
import useStore from "@src/store/store";

const props = defineProps<{
  calls: ICall[];
  chatStatus: string;
  delayLoading: string;
  openInfoModal: (call: ICall) => void;
}>();
const store = useStore();

let keyword: CallList;
</script>

<template>
  <div>
    <!--search bar-->
    <div class="ms-5" v-if="(store.calls as ICall[])?.length > 0">
      <SearchInput v-model="keyword" />
    </div>
    <Call
      v-for="call in props.calls"
      :call="call"
      :open-info-modal="props.openInfoModal"
    />
  </div>
</template>
