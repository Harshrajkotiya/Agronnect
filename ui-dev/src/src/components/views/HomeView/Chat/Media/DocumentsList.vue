<script setup lang="ts">
import Typography from "@src/components/ui/data-display/Typography.vue";
import { convertFileSize, formatDateTime } from "@src/utils";
const props = defineProps(["docFiles"]);
</script>

<template>
  <div v-if="docFiles.length > 0" class="h-[75vh] overflow-y-scroll min-[1000px]:h-[52vh]" style="overflow-x: hidden;">
    <div class="select-none  " v-for="m in docFiles" >
      <a
        :aria-label="'conversation with'"
        tabindex="0"
        class="w-full h-[60px] px-5 mt-5 my-4 flex transition duration-500 ease-out"
        :href="m?.media_files?.path"
        download="download"
        target="_blank"
      >
        <div class="mr-4 border rounded-md border-[#E9ECEF] p-5">
          <img
            v-if="m.media_files?.thumb_path != null"
            :src="m.media_files?.thumb_path"
          />
          <img v-else src="/svg/DocumentIcon.svg" alt="Network error" />
        </div>
        <div class="w-full flex flex-col mt-3">
          <div class="w-full">
            <div class="flex items-start">
              <div class="grow text-start">
                <Typography variant="heading-2">
                  <p class="text-[15px] break-words w-[80px] lg:w-full">{{ m.media_files?.name }}</p>
                </Typography>
                <p class="text-[#7B809A] py-3">
                  {{ convertFileSize(m.media_files?.size) }}
                </p>
              </div>

              <Typography variant="body-1" class="text-[#7B809A]">
                <p class="text-[13px] min-[425px]:text-[15px] ml-4 lg:ml-0">
                  {{ formatDateTime(m.media_files?.created_at) }}
                </p>
              </Typography>
            </div>
          </div>
        </div>
      </a>
      <hr />
    </div>
  </div>

  <div v-else="docFiles.length <= 0" class="font-bold text-center h-[60vh]">
    No documents appear in this chat
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