<script setup lang="ts">
import type { MediaFile } from "@src/types";
import type { Ref } from "vue";

import { onMounted, onUnmounted, ref } from "vue";

import Spinner from "@src/components/ui/utils/Spinner.vue";
import WaveSurfer from "wavesurfer.js";

const props = defineProps<{
  recording: MediaFile;
  self?: boolean;
  loader?: boolean;
}>();

const wavesurfer: Ref<any> = ref(null);
const playing = ref(false);
const loading = ref(true);
const playTimer = ref("");

const handleTogglePlay = () => {
  if (wavesurfer.value) {
    if (playing.value) {
      playing.value = false;
      wavesurfer.value.pause();
    } else {
      playing.value = true;
      wavesurfer.value.play();
    }
  }
};

onMounted(() => {
  const containerId = "#waveform-" + props.recording.id;

  const waveform: HTMLElement | null = document.querySelector(containerId);

  if (waveform) {
    wavesurfer.value = WaveSurfer.create({
      container: waveform,
      waveColor: "#7B809A",
      progressColor: "#00AB89",
      cursorColor: "transparent",
      barWidth: 3,
      barRadius: 8,
      cursorWidth: 1,
      height: 20,
      barGap: 3,
      normalize: true,
      responsive: true,
      fillParent: true,
    });
    wavesurfer.value.load(props.recording.path);
    wavesurfer.value.getDuration();

    function secondsToTimestamp(seconds: number) {
      seconds = Math.floor(seconds);
      let h: number | string = Math.floor(seconds / 3600);
      let m: number | string = Math.floor((seconds - h * 3600) / 60);
      let s: number | string = seconds - h * 3600 - m * 60;

      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    }

    wavesurfer.value.on("ready", function () {
      loading.value = false;
    });
    wavesurfer.value.on("ready", function () {
      loading.value = false;
      playTimer.value = secondsToTimestamp(wavesurfer.value.getCurrentTime());
    });
    wavesurfer.value.on("audioprocess", function () {
      loading.value = false;
      playTimer.value = secondsToTimestamp(wavesurfer.value.getCurrentTime());
    });
    wavesurfer.value.on("seek", function () {
      loading.value = false;
      playTimer.value = secondsToTimestamp(wavesurfer.value.getCurrentTime());
    });
  }
});

onUnmounted(() => {
  wavesurfer.value!.pause();
});
</script>

<template>
  <div
    class="flex items-center outline-none"
    tabindex="0"
    aria-label="audio message"
  >
    <div
      v-if="$props.loader"
      class="p-4 mr-4 flex justify-center items-center rounded-[12px] outline-none transition-all duration-200 bg-[#00AB89] active:bg-[#00AB89] my-3"
    >
      <Spinner />
    </div>
  
    <button v-else
     
      @click="handleTogglePlay"
      class="pt-4 pb-4 ps-2 flex justify-center items-center rounded-[12px] outline-none transition-all focus:ring-0 focus:outline-none"
      :aria-label="playing ? 'pause' : 'play'"
    >
      <img
        src="/svg/pause.svg"
        alt="pause"
        v-if="playing"
        width="50"
        height="50"
      />
      <img src="/svg/play.svg" alt="play" v-else width="50" height="50" />
    </button>
 
    <div class="w-full relative flex items-center justify-center">
      <div :id="'waveform-' + props.recording.id" class="w-[150px]"></div>
      <div
        class="absolute border animate-pulse w-[150px] border-gray-300"
        v-show="loading"
      ></div>
    </div>
   
    <p class="text-[#7B809A] text-[9px]" v-if="playTimer != '00:00'">
      {{ playTimer }}
    </p>
    <p class="text-[#7B809A] text-[9px]" v-else>
     {{ props.recording.duration }}
    </p>
  </div>
</template>
