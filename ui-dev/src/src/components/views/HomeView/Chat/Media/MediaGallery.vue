<script setup lang="ts">
import { Ref, ref } from 'vue';
import Carousel from "@src/components/ui/data-display/Carousel/Carousel.vue";

const props = defineProps(["mediaFiles"]);

const isLastImageInFirstRow = (index: number) =>
index < 4 && (index + 1) % 4 === 0;

const isFirstImageInLastRow = (index: number) => {
  const numRows = Math.ceil(props.mediaFiles.length / 4);
  const firstImageIndexInLastRow = (numRows - 1) * 4;
  return index === firstImageIndexInLastRow;
};

const openCarousel: Ref<boolean> = ref(false);
const selectedAttachmentId: Ref<number | undefined> = ref();

  const handleClick =(index: number)=>{
    openCarousel.value = true;
    selectedAttachmentId.value = index;
  }

  const closeCarousel =()=>{
    openCarousel.value = false;
  }
</script>
<template>


<div
    v-if="mediaFiles.length > 0"
    class="h-[75vh] overflow-y-scroll min-[1000px]:h-[52vh]"
  >
    <div class="h-auto image_grid">
      <div class="row cursor-pointer" v-for="(image, index) in mediaFiles" :key="index"  @click="handleClick(index + 1)">
        
        <img
          :class="{
            image_item: true,
            first_row_last_image: isLastImageInFirstRow(index),
            last_row_first_image: isFirstImageInLastRow (index),
          }"
          :src="image.media_files?.thumb_path"
          alt="Network error"
        />
      </div>
    </div>
  </div>
  <div v-else="mediaFiles.length <= 0" class="font-bold text-center h-[60vh]">
    No media appear in this chat
  </div>

  <Carousel :open="openCarousel" :close-carousel="closeCarousel"  :mediaGroup="mediaFiles" :starting-id="(selectedAttachmentId as number)"/>

</template>

<style scoped>
.image_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5px;
}

.image_item {
  text-align: center;
  max-height: 100%;
  object-fit: cover;
}

.image_item img {
  max-width: 100%;
  height: 100%;
}

.first_row_last_image {
  border-radius: 0px 26px 0px 0px;
}
.last_row_first_image {
  border-radius: 0px 0px 0px 26px;
}
</style>
