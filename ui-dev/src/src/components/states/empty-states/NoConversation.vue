<script setup lang="ts">
import Typography from "@src/components/ui/data-display/Typography.vue";
import useStore from "@src/store/store";

const apiUrl = import.meta.env.VITE_LOGIN_URL;
const store = useStore();
const props = defineProps<{
  vertical?: boolean;
}>();
const handleReviewProfile =()=>{
  window.location.href = `${apiUrl}/update_profile`;
}
</script>

<template>
  <div
    class="w-full p-5 flex"
    :class="
      props.vertical
        ? ['flex-col', 'justify-center', 'items-center']
        : ['flex-row']
    "
  >
    <!--content-->
    <div
      :class="props.vertical ? [] : ['flex', 'flex-col', 'items-center']"
      v-if="store.userType === 'farmer'"
    >
      <Typography class="mb-3 font-bold text-[20px]"
        >Get ready to chat!</Typography
      >
      <Typography class="text-[16px] text-[#7B809A] text-center">
        To start a conversation, send a consultation request to a specialist.
        After they send you an offer, accept it to initiate the chat. Once
        accepted, your chat will appear here.
      </Typography>
      <div class="flex justify-center">
        <button
          class="mt-5 bg-[#00AB89] px-6 py-4 rounded-md text-white uppercase font-bold text-[14px]"
          style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.25)"
        >
          Find Specialists
        </button>
      </div>
    </div>
    <div
      :class="props.vertical ? [] : ['flex', 'flex-col', 'items-center']"
      v-else-if="store.userType === 'specialist'"
    >
      <Typography class="mb-3 font-bold text-[20px]"
        >Get ready to chat!</Typography
      >
      <Typography class="text-[16px] text-[#7B809A] text-center">
        Complete your profile thoroughly to be visible to farmers. When a farmer
        accepts your offer after a consultation request, the chat will appear
        here.
      </Typography>
      <div class="flex justify-center">
        <button
          class="mt-5 bg-[#00AB89] px-6 py-4 rounded-md text-white uppercase font-bold text-[14px]"
          style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.25)" @click="handleReviewProfile()"
        >
          Review Profile
        </button>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>
