<script setup lang="ts">
import { CheckIcon, ClockIcon } from "@heroicons/vue/24/outline";
import DoubleChecksRead from "@src/components/views/HomeView/Chat/ChatMiddle/Message/DoubleChecksRead.vue";
import DoubleChecksReceive from "@src/components/views/HomeView/Chat/ChatMiddle/Message/DoubleChecksReceive.vue";

const props = defineProps<{
  state: string | undefined;
}>();

</script>

<template>
  <ClockIcon
    v-if="props.state === 'Waiting'"
    class="w-[14px] h-[14px] text-gray-300"
  />
  <CheckIcon
    v-else-if="props.state === 'Sent'"
    class="w-[14px] h-[14px] text-gray-300"
  />
  <DoubleChecksRead v-else-if="props.state === 'Read'"/>
  <DoubleChecksReceive v-else-if="props.state === 'Receive'"/>
</template>
