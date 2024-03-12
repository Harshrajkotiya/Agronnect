<script setup lang="ts">
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";

import { IContact, IConversation } from "@src/types";
import { getAvatar, getFullName, getName } from "@src/utils";

import {
BellIcon,
NoSymbolIcon,
TrashIcon
} from "@heroicons/vue/24/outline";
import InfoItem from "@src/components/shared/blocks/InfoItem.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import Button from "@src/components/ui/inputs/Button.vue";

const props = defineProps<{
  conversation: IConversation;
  contact?: IContact;
  closeModal: () => void;
}>();

const openImageViewer = ref(false);
</script>

<template>
  <div>
    <div class="mb-6 px-5 flex justify-between items-center">
      <!--title-->
      <Typography
        variant="heading-1"
        id="modal-title"
        class="default-outline"
        tabindex="0"
      >
        <span v-if="conversation.type === 'couple' || props.contact"
          >Contact</span
        >
        <span v-else-if="conversation.type === 'group'">Group</span>
        <span v-else-if="conversation.type === 'broadcast'">Broadcast</span>
        Info
      </Typography>

      <!--close button-->
      <Button
        v-if="!props.contact"
        @click="props.closeModal"
        variant="outlined"
        color="danger"
        typography="body-4"
      >
        esc
      </Button>

      <!--return button-->
      <button
        v-else
        @click="
          $emit('active-page-change', {
            tabName: 'members',
            animationName: 'slide-right',
          })
        "
        class="group p-2 border rounded-full border-gray-200 focus:outline-none focus:border-indigo-100 focus:bg-indigo-100 hover:bg-indigo-100 hover:border-indigo-100 transition-all duration-200 outline-none"
      >
        <ArrowUturnLeftIcon
          class="w-5 h-5 text-black opacity-100 group-hover:text-indigo-500 group-hover:opacity-100"
        />
      </button>
    </div>

    <!--top-->
    <div class="w-full p-5 pb-6">
      <div class="flex">
        <!--avatar-->
        <div class="mr-5">
          <button
            v-if="props.contact"
            @click="openImageViewer = true"
            class="outline-none"
            aria-label="view avatar"
          >
            <div
              :style="{ backgroundImage: `url(${props.contact.avatar})` }"
              class="w-[38px] h-[38px] rounded-full bg-cover bg-center"
            ></div>
          </button>

          <button
            v-else
            @click="openImageViewer = true"
            class="outline-none"
            aria-label="view avatar"
          >
            <div
              :style="{
                backgroundImage: `url(${getAvatar(props.conversation)})`,
              }"
              class="w-[38px] h-[38px] rounded-full bg-cover bg-center"
            ></div>
          </button>
        </div>

        <!--name-->
        <div class="w-full flex justify-between">
          <div>
            <Typography variant="heading-2" class="mb-3 mr-5 text-start">
              <span v-if="props.contact">
                {{ getFullName(props.contact) }}
              </span>

              <span v-else>
                {{ getName(props.conversation) }}
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>

    <!--middle-->
    <div class="w-full py-5 border-t border-gray-100">
      <!--(both) notifications-->
      <div class="px-5 flex items-center">
        <InfoItem :icon="BellIcon" title="notifications" switch />
      </div>
    </div>

    <!--bottom-->
    <div class="w-full border-t border-gray-100">
      <!--block contact-->
      <div
        v-if="conversation.type === 'couple' || props.contact"
        class="px-5 pt-5 group"
      >
        <InfoItem
          :icon="NoSymbolIcon"
          title="block contact"
          link
          color="danger"
        />
      </div>

      <!--delete contact-->
      <div
        v-if="conversation.type === 'couple' || props.contact"
        class="px-5 pt-5 group"
      >
        <InfoItem
          :icon="TrashIcon"
          title="delete contact"
          link
          color="danger"
        />
      </div>
    </div>
  </div>
</template>
