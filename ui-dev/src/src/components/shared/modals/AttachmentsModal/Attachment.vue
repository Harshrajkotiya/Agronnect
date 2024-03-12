<script setup lang="ts">
import type { IAttachment } from "@src/types";

import {
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/vue/24/outline";
import Typography from "@src/components/ui/data-display/Typography.vue";
import { convertFileSize } from "@src/utils"

const props = defineProps<{
  attachment: IAttachment | null;
}>();



</script>

<template>
  <div href="#" class="flex px-5 py-4 transition-all duration-300">
    <!--icon-->
    <div class="w-8 h-8 mr-4 rounded-full flex justify-center items-center bg-gray-100">
      <PhotoIcon class="stroke-1 h-5 w-5 text-black"
        v-if="attachment?.type === 'image'" />
      <VideoCameraIcon class="stroke-1 h-5 w-5 text-black"
        v-else-if="attachment?.type === 'video'" />
      <DocumentIcon class="stroke-1 h-5 w-5 text-black"
        v-else-if="attachment?.type === 'file'" />
    </div>

    <!--name, date and size-->
    <div class="grow">
      <div class="flex items-center justify-between mb-3">
        <Typography variant="heading-2" tabindex="0">
          {{ attachment?.name }}
        </Typography>
      </div>

      <div class="flex justify-start">
        <Typography variant="body-2" tabindex="0">
          {{ convertFileSize(attachment?.size) }}
        </Typography>
      </div>
    </div>

  </div>
</template>
