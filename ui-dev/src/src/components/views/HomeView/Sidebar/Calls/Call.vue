<script setup lang="ts">
import { computed } from "vue";

import { ICall } from "@src/types";
import { getCallName, getOtherMembers } from "@src/utils";

import { PhoneIcon } from "@heroicons/vue/24/solid";
import CallAvatar from "@src/components/shared/blocks/CallAvatar.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";

const props = defineProps<{
  call: ICall;
  active?: boolean;
  openInfoModal?: (call: ICall) => void;
  openVoiceCallModal?: () => void;
  endCall?: () => void;
}>();

const members = computed(() => {
  return getOtherMembers(props.call);
});

const handleOpenInfoModal = () => {
  if (props.openInfoModal && !props.active) {
    props.openInfoModal(props.call);
  }
};
</script>

<template>
  <div>
    <component
      :is="props.active ? 'div' : 'button'"
      :aria-label="'voice call with ' + getCallName(props.call, true)"
      @click="handleOpenInfoModal"
      class="w-full h-[92px] px-5 py-6 flex rounded focus:outline-none transition duration-500 ease-out"
      :class="
        props.active
          ? ['border border-dashed border-green-100 ']
          : [
              'focus:bg-indigo-50 hover:bg-[#F8F9FA] active:bg-indigo-100',
            ]
      "
      tabindex="0"
    >
      <!--profile images-->
      <div :class="members.length === 1 ? ['mr-6'] : ['mr-[20px]']">
        <div class="relative">
          <button
            v-if="props.active"
            class="relative block"
            @click="props.openVoiceCallModal"
          >
            <CallAvatar
              v-for="(member, index) in members"
              :member="member"
              :index="index"
              :members-length="members.length"
            />
          </button>

          <CallAvatar
            v-else
            v-for="(member, index) in members"
            :member="member"
            :index="index"
            :members-length="members.length"
          />
        </div>
      </div>

      <div class="w-full flex gap-3">
        <div class="w-full w-[60%]">
          <!--contacts names-->
          <div class="items-start">
            <div class="grow mb-4 text-start">
              <button
                v-if="props.active"
                class="block"
                @click="props.openVoiceCallModal"
              >
                <Typography variant="heading-2">
                  {{ getCallName(props.call) }}
                </Typography>
              </button>

              <div v-if="props.call.status === 'missed'">
                <Typography variant="heading-2">
                  <p class="text-[#FD3333]">{{ getCallName(props.call) }}</p>
                </Typography>
              </div>

              <Typography v-else variant="heading-2">
                {{ getCallName(props.call) }}
              </Typography>
            </div>

            <!--end Call-->
            <button
              v-if="props.active"
              @click="props.endCall"
              class="p-[5px] flex justify-center items-center rounded-full outline-none bg-red-400 hover:bg-red-500 active:bg-red-600 transition-all duratoin-500 ease"
            >
              <PhoneIcon class="w-[14px] h-[14px] text-white" />
            </button>

            <!--status icon-->
            <div v-else class="mr-2">
              <div
                v-if="props.call.status === 'missed'"
                class="w-[14px] h-[14px] text-red-300 flex mb-4"
              >
                <img
                  src="/svg/MissedCallIcon.svg"
                  alt="Network error"
                  class="mr-4"
                />
                <p class="text-[#7B809A] font-normal text-[14px] mt-[-4px]">
                  Missed
                </p>
              </div>

              <div
                v-else-if="props.call.status === 'sent'"
                class="w-[14px] h-[14px] text-green-300 flex"
              >
                <img
                  src="/svg/PhoneOutgoing.svg"
                  alt="Network error"
                  class="mr-4"
                />
                <p class="text-[#7B809A] font-normal text-[14px] mt-[-4px]">
                  Outgoing
                </p>
              </div>

              <div
                v-else-if="props.call.status === 'received'"
                class="w-[14px] h-[14px] text-green-300 flex"
              >
                <img
                  src="/svg/PhoneIncoming.svg"
                  alt="Network error"
                  class="mr-4"
                />
                <p class="text-[#7B809A] font-normal text-[14px] mt-[-4px]">
                  Incoming
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="w-[40%]">
          <!--recording length-->
          <Typography
            v-if="props.active"
            variant="body-2"
            no-color
            class="flex justify-start items-center text-indigo-300"
          >
            {{ props.call.length }}
          </Typography>

          <!--recording date-->
          <Typography
            v-else
            variant="body-2"
            class="flex justify-start items-center"
          >
            {{ props.call.date }}
          </Typography>
        </div>
      </div>
    </component>

    <hr class="w-full" />
  </div>
</template>
