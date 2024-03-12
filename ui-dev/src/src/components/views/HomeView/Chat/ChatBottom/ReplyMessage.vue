<script setup lang="ts">
import useStore from "@src/store/store";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import SlideTransition from "@src/components/ui/transitions/SlideTransition.vue";
import MessagePreview from "@src/components/views/HomeView/Chat/MessagePreview.vue";

const store = useStore();

const removeReplyMessage = () => {
  store.isReply = false;
  store.singleMsg = null;
};
</script>

<template>

  <SlideTransition animation="shelf-up">
    <div v-if="store.singleMsg" class="flex">

      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-[92%] px-5 py-2 transition-all duration-200 h-full flex space-x-4 -mb-6">
          <div class="bottom-0 w-[96%] px-3 bg-white flex items-center transition-all duration-200 ">
            <MessagePreview :message="store.singleMsg" />
          
          </div>
          <div class="w-[4%] ">
            <IconButton @click="removeReplyMessage" class="group w-7 h-7" title="remove reply" aria-label="remove reply">
              <div class="w-[16px] h-[16px] text-gray-300 group-hover:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                    fill="#7B809A" />
                </svg>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  </SlideTransition>
</template>
