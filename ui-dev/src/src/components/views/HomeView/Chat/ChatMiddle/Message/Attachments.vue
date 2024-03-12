<script setup lang="ts">
import Carousel from "@src/components/ui/data-display/Carousel/Carousel.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import Receipt from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Receipt.vue";
import Recording from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Recording.vue";
import useStore from "@src/store/store";
import "@src/style.css";
import type { ChatMessages, MediaFile } from "@src/types";
import { convertFileSize, formatDateTime, shorten } from "@src/utils";
import type { Ref } from "vue";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  message?: ChatMessages;
  self?: boolean;
  selected?: boolean;
  previous?: boolean;
  next?: boolean;
  mediaGroup?: ChatMessages[];
  handleOpenContextMenu?: (event: MouseEvent) => void;
  isMobile?: boolean;
  showSVG?: boolean;
}>();

watch([props.showSVG], () => {});

const store = useStore();
const openCarousel: Ref<boolean> = ref(false);
const selectedAttachmentId: Ref<number | undefined> = ref();

// close the carousel
const closeCarousel = () => {
  openCarousel.value = false;
};

// (event) test is the attachment is the second media item.
const isNumber = (
  attachment: MediaFile,
  number: number,
  largerThan?: boolean,
) => {
  let counter = 0;
  let caseCorrect = false;

  if (props.mediaGroup) {
    for (let item of props.mediaGroup) {
      const isVideoOrImage = ["video", "image"].includes(
        item.media_files?.type ?? "",
      );
      const isWebp =
        item.media_files?.name && item.media_files.name.endsWith(".webp");

      if (isVideoOrImage || isWebp) {
        counter += 1;
        if (largerThan) {
          if (item.media_files?.id === attachment.id && counter > number) {
            caseCorrect = true;
          }
        } else {
          if (item.media_files?.id === attachment.id && counter === number) {
            caseCorrect = true;
          }
        }
      }
    }
  }
  return caseCorrect;
};
// number of videos attached to this message.
const numberOfMedia = computed(() => {
  let counter = 0;

  if (props.mediaGroup) {
    for (let attachment of props.mediaGroup) {
      const isVideoOrImage = ["video", "image"].includes(
        attachment.media_files?.type ?? "",
      );
      const isWebp =
        attachment.media_files?.name &&
        attachment.media_files.name.endsWith(".webp");

      if (isVideoOrImage || isWebp) {
        counter += 1;
      }
    }
  }

  return counter;
});

// open the carousel with the selected index
const openCarouselWithAttachment = (attachmentId: number | undefined) => {
  selectedAttachmentId.value = attachmentId;
  openCarousel.value = true;
};

// Update the Message times
let messageDateAndTime: Ref<string | undefined | null> = ref(
  Array.isArray(props.mediaGroup) && props.mediaGroup[0].media_files?.created_at
    ? props.mediaGroup[0].media_files?.created_at.toString()
    : props.message?.media_files?.created_at &&
        props.message?.media_files?.created_at.toString(),
);

setInterval(() => {
  messageDateAndTime.value =
    Array.isArray(props.mediaGroup) &&
    props.mediaGroup[0].media_files?.created_at
      ? store.messageSentTime(
          props.mediaGroup[0].media_files?.created_at.toString(),
        )
      : props.message?.media_files?.created_at &&
        store.messageSentTime(
          props.message?.media_files?.created_at.toString(),
        );
}, 0);

async function downloadFile(path: string) {
  const kmlUrl = path;

  try {
    const response = await fetch(kmlUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "file.kml"); // or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error:", error);
  }
}
</script>

<template>
  <div v-if="props.message?.hasTemporaryId">
    <div class="flex">
      <a>
        <svg
          v-if="
            props.message?.media_files?.type === 'docs' ||
            props.message?.media_files?.type === 'kmz' ||
            props.message?.media_files?.type === 'kml'
          "
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mx-5 my-3"
        >
          <rect
            x="0.5"
            y="0.5"
            width="49"
            height="49"
            rx="7.5"
            fill="white"
            stroke="#E9ECEF"
          />
          <path
            d="M19 15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17V33C17 33.5304 17.2107 34.0391 17.5858 34.4142C17.9609 34.7893 18.4696 35 19 35H31C31.5304 35 32.0391 34.7893 32.4142 34.4142C32.7893 34.0391 33 33.5304 33 33V21L27 15H19ZM19 17H26V22H31V33H19V17ZM21 25V27H29V25H21ZM21 29V31H26V29H21Z"
            fill="#7B809A"
          />
        </svg>
        <img
          v-else-if="
            props.message?.media_files?.type === 'images' ||
            props.message?.media_files?.type === 'videos'
          "
          src="/svg/ImageFileIcon.svg"
          alt="ImageFile Icon"
          class="mx-5 my-3"
        />
      </a>
      <div class="flex flex-col justify-center">
        <Typography
          variant="heading-2"
          :no-color="true"
          class="mb-3"
          :class="props.self ? ['text-black'] : ['text-black']"
        >
          {{ props.message?.media_files?.name }}</Typography
        >
        <p class="text-[#7B809A] text-[16px]">
          {{ props.message?.media_files?.loadingPercent }}
        </p>
      </div>
    </div>
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: props.message?.media_files?.loadingPercent }"
        aria-valuenow="loadingPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  </div>

  <div v-else class="flex w-full">
    <div class="mr-2 flex items-end w-full">
      <!-- single image -->
      <div
        v-if="
          props.message?.media_files?.type === 'image' ||
          (props.message?.media_files?.name ?? '').endsWith('.webp')
        "
        @click="openCarouselWithAttachment(props.message?.media_files?.id)"
        class="cursor-pointer"
      >
        <img
          :src="props.message?.media_files?.thumb_path"
          alt="Networking Error"
          class="w-[250px]"
          :class="{
            'rounded-l order-2 bg-[#FFF4EA] ':
              (props.self &&
                !props.selected &&
                !props.previous &&
                props.next) ||
              props.message?.media_files,
            'rounded-r rounded-l-none order-2 bg-[#FFF4EA]':
              !props.self &&
              !props.selected &&
              props.previous &&
              props.next &&
              props.message?.media_files,
            'bg-[#00AB8966]': props.selected,
          }"
        />
      </div>

      <!-- single video -->
      <div
        v-if="
          props.message?.media_files?.type === 'video' &&
          !(props.message?.media_files?.name ?? '').endsWith('.avi') &&
          props.message?.content != 'The message has been removed'
        "
        @click="openCarouselWithAttachment(props.message?.media_files?.id)"
        class="relative"
      >
        <video
          width="320"
          height="140"
          :class="{
            'rounded-l order-2 bg-[#FFF4EA]':
              props.self && !props.selected && props.message?.media_files,
            'rounded-r-lg order-2 bg-[#FFF4EA]':
              !props.self &&
              !props.selected &&
              props.previous &&
              props.next &&
              props.message?.media_files,
            'bg-[#00AB8966]': props.selected,
          }"
        >
          <source :src="props.message?.media_files?.path" type="video/mp4" />
        </video>

        <span
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src="/svg/PlayIcon.svg" alt="Play Icon" class="cursor-pointer" />
        </span>
      </div>

      <!-- Multiple Images and videos -->
      <div
        v-if="mediaGroup && mediaGroup?.length >= 4"
        class="grid grid-cols-2"
      >
        <div
          v-for="(attachment, index) in props.mediaGroup"
          :key="index"
          class="mr-2 flex items-end mt-1 cursor-pointer"
        >
          <!--image-->
          <div
            v-if="
              attachment.media_files?.type === 'image' ||
              (attachment.media_files?.name ?? '').endsWith('.webp')
            "
            @click="openCarouselWithAttachment(attachment.media_files?.id)"
            class="outline-none"
            :aria-label="
              numberOfMedia > 2
                ? (props.mediaGroup as []).length - 1 + ' more attachments'
                : attachment.media_files?.name
            "
          >
            <div
              v-if="
                attachment.media_files &&
                !isNumber(attachment.media_files, 4, true)
              "
              :style="{
                backgroundImage: `url(${
                  attachment.media_files?.thumb_path ||
                  'https://i.stack.imgur.com/WFy1e.jpg'
                }) `,
              }"
              class="bg-cover bg-center"
              :class="{
                'w-[200px] h-[200px]': numberOfMedia === 1,
                'md:w-[110px] md:h-[100px] xs:w-[100px] xs:h-[95px]':
                  numberOfMedia !== 1,
                'rounded-l':
                  (props.self && index === 2) ||
                  isNumber(attachment.media_files, 1),
                'rounded-r': !props.self && (index === 1 || index === 3),
              }"
            >
              <sub
                class="top-[80%] left-[50%]"
                v-if="!isNumber(attachment.media_files, 4)"
              >
                <!--date-->

                <div
                  :class="['absolute', props.self ? 'mr-2 order-1' : 'mr-4']"
                >
                  <Typography
                    variant="body-1"
                    class="whitespace-pre text-white"
                    style="font-size: smaller"
                  >
                    {{
                      formatDateTime(
                        attachment.media_files?.created_at?.toString() || "",
                      ).split(", ")[1]
                    }}
                  </Typography>
                </div>
              </sub>
              <!--first image-->
              <div
                v-if="isNumber(attachment.media_files, 1)"
                class="w-full h-full flex justify-center items-center hover:bg-opacity-10 transition duration-200 border-0"
                :class="{ 'rounded-l': props.self }"
              ></div>

              <!--more images overlay-->
              <div
                v-if="isNumber(attachment.media_files, 4)"
                class="w-full h-full flex items-center text-[20px] justify-center bg-black bg-opacity-50 text-white hover:bg-opacity-10 transition duration-200"
                :class="{ 'rounded-r': !props.self && index === 3 }"
              >
                {{
                  props.mediaGroup && props.mediaGroup?.length !== 4
                    ? "+" + (props.mediaGroup.length - 3)
                    : ""
                }}
              </div>
            </div>
          </div>

          <!--video-->
          <button
            v-if="
              attachment.media_files?.type === 'video' &&
              !(attachment.media_files?.name?.toLowerCase() ?? '').endsWith(
                '.avi',
              )
            "
            @click="openCarouselWithAttachment(attachment.media_files?.id)"
            class="outline-none"
            :aria-label="
              numberOfMedia > 2
                ? (props.mediaGroup as []).length - 1 + ' more attachments'
                : attachment.media_files?.name
            "
          >
            <div
              v-if="!isNumber(attachment.media_files, 4, true)"
              :style="{
                backgroundImage: `url(${
                  attachment.media_files?.thumb_path ||
                  'https://i.stack.imgur.com/WFy1e.jpg'
                })`,
              }"
              class="bg-cover bg-center"
              :class="{
                'w-[200px] h-[200px]': numberOfMedia === 1,
                'md:w-[110px] md:h-[100px] xs:w-[100px] xs:h-[95px]':
                  numberOfMedia !== 1,
                'rounded-l':
                  (props.self && index === 2) ||
                  isNumber(attachment.media_files, 1),
                'rounded-r': !props.self && (index === 1 || index === 3),
              }"
            >
              <!--first video-->
              <div
                v-if="isNumber(attachment.media_files, 1)"
                class="w-full h-full flex justify-center items-center hover:bg-opacity-10 transition duration-200 border-0"
                :class="{ 'rounded-l': props.self }"
              ></div>

              <!--more video overlay-->
              <div
                v-if="isNumber(attachment.media_files, 4)"
                class="w-full h-full flex items-center text-[20px] justify-center bg-black bg-opacity-50 text-white hover:bg-opacity-10 transition duration-200"
                :class="{ 'rounded-r': !props.self && index === 3 }"
              >
                {{
                  props.mediaGroup && props.mediaGroup?.length !== 4
                    ? "+" + (props.mediaGroup.length - 3)
                    : ""
                }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Video with .avi extension -->
      <div
        v-if="
          props.message?.media_files?.type === 'video' &&
          (props.message?.media_files?.name ?? '').endsWith('.avi') &&
          props.message?.content != 'The message has been removed'
        "
        :class="{
          'rounded-l order-2 bg-[#FFF4EA] w-full':
            props.self &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
          'rounded-r rounded-l-none order-2 bg-white w-full':
            !props.self &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
        }"
        class="relative w-[60%]"
      >
        <div class="flex">
          <!--download button / icons-->
          <a
            :href="props.message?.media_files?.path"
            download="download"
            target="_blank"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mx-5 my-3"
            >
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="7.5"
                fill="white"
                stroke="#E9ECEF"
              />
              <path
                d="M19 15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17V33C17 33.5304 17.2107 34.0391 17.5858 34.4142C17.9609 34.7893 18.4696 35 19 35H31C31.5304 35 32.0391 34.7893 32.4142 34.4142C32.7893 34.0391 33 33.5304 33 33V21L27 15H19ZM19 17H26V22H31V33H19V17ZM21 25V27H29V25H21ZM21 29V31H26V29H21Z"
                fill="#7B809A"
              />
            </svg>
          </a>
          <!-- </button> -->

          <div class="flex flex-col justify-center break-words messageDetails">
            <Typography
              variant="heading-2"
              :no-color="true"
              class="mb-3 messagefilename"
              :class="props.self ? ['text-black'] : ['text-black']"
            >
              {{
                props.isMobile === true
                  ? shorten(props.message?.media_files?.name || "", 8)
                  : props.message?.media_files?.name
              }}
            </Typography>

            <Typography
              class="flex messagefilesize"
              variant="body-2"
              :no-color="true"
              :class="props.self ? ['text-[#7B809A] '] : ['text-[#7B809A]']"
            >
              {{ convertFileSize(props.message?.media_files?.size) }}
            </Typography>
            <div class="flex justify-end items-end">
              <div class="flex items-center absolute right-[-68%] top-[76%]">
                <!-- Contextmenu Icon -->
                <div v-if="showSVG">
                  <span
                    class="absolute w-[300px] z-9999"
                    @click="props?.handleOpenContextMenu"
                  >
                    <img
                      src="/svg/ContextMenuIcon.svg"
                      alt="context icon"
                      :class="
                        props.self
                          ? 'mt-[-65px] ml-[45px]'
                          : 'mt-[-70px] ml-[10px]'
                      "
                    />
                  </span>
                </div>
                <sub>
                  <!--date-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="mt-2"
                  >
                    <Typography
                      variant="body-1"
                      class="whitespace-pre text-[#7B809A]"
                      style="font-size: smaller"
                    >
                      {{ messageDateAndTime }}
                    </Typography>
                  </div>
                </sub>
                <sub>
                  <!--read receipt-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="right-[-70%]"
                  >
                    <Receipt v-if="props.self" :state="props.message?.status" />
                  </div>
                </sub>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--file-->
      <div
        v-if="
          props.message?.media_files?.type === 'doc' &&
          props.message?.content != 'The message has been removed'
        "
        :class="{
          'rounded-l order-2 bg-[#FFF4EA] ':
            props.self &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
          'rounded-r rounded-l-none order-2 bg-white':
            !props.self &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
        }"
        class="relative w-[60%]"
      >
        <div class="flex">
          <!--download button / icons-->
          <a
            :href="props.message?.media_files?.path"
            download="download"
            target="_blank"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mx-5 my-3"
            >
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="7.5"
                fill="white"
                stroke="#E9ECEF"
              />
              <path
                d="M19 15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17V33C17 33.5304 17.2107 34.0391 17.5858 34.4142C17.9609 34.7893 18.4696 35 19 35H31C31.5304 35 32.0391 34.7893 32.4142 34.4142C32.7893 34.0391 33 33.5304 33 33V21L27 15H19ZM19 17H26V22H31V33H19V17ZM21 25V27H29V25H21ZM21 29V31H26V29H21Z"
                fill="#7B809A"
              />
            </svg>
          </a>
          <!-- </button> -->

          <div class="flex flex-col justify-center break-words messageDetails">
            <Typography
              variant="heading-2"
              :no-color="true"
              class="messagefilename mb-3"
              :class="props.self ? ['text-black '] : ['text-black']"
            >
              {{
                props.isMobile === true
                  ? shorten(props.message?.media_files?.name || "", 8)
                  : props.message?.media_files?.name
              }}
            </Typography>

            <Typography
              class="flex messagefilesize"
              variant="body-2"
              :no-color="true"
              :class="props.self ? ['text-[#7B809A]'] : ['text-[#7B809A]']"
            >
              {{ convertFileSize(props.message?.media_files?.size) }}
            </Typography>
            <div class="flex justify-end items-end mx-auto">
              <div class="flex items-center absolute right-[-68%] top-[76%]">
                <!-- Contextmenu Icon -->
                <div v-if="showSVG">
                  <span
                    class="absolute w-[300px] z-9999"
                    @click="props?.handleOpenContextMenu"
                  >
                    <img
                      src="/svg/ContextMenuIcon.svg"
                      alt="context icon"
                      :class="
                        props.self
                          ? 'mt-[-65px] ml-[45px]'
                          : 'mt-[-70px] ml-[10px]'
                      "
                    />
                  </span>
                </div>
                <sub>
                  <!--date-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="mt-2"
                  >
                    <Typography
                      variant="body-1"
                      class="whitespace-pre text-[#7B809A]"
                      style="font-size: smaller"
                    >
                      {{ messageDateAndTime }}
                    </Typography>
                  </div>
                </sub>
                <sub>
                  <!--read receipt-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="right-[-70%]"
                  >
                    <Receipt v-if="props.self" :state="props.message?.status" />
                  </div>
                </sub>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--kmz, kml files-->
      <div
        v-if="
          props.message?.media_files?.type === 'geographical' &&
          props.message?.content != 'The message has been removed'
        "
        class="relative w-[60%]"
      >
        <div class="flex">
          <!--download button / icons-->
          <a
            :href="props.message?.media_files?.path"
            target="_blank"
            @click="downloadFile(props.message?.media_files?.path ?? '')"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mx-5 my-3"
            >
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="7.5"
                fill="white"
                stroke="#E9ECEF"
              />
              <path
                d="M19 15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17V33C17 33.5304 17.2107 34.0391 17.5858 34.4142C17.9609 34.7893 18.4696 35 19 35H31C31.5304 35 32.0391 34.7893 32.4142 34.4142C32.7893 34.0391 33 33.5304 33 33V21L27 15H19ZM19 17H26V22H31V33H19V17ZM21 25V27H29V25H21ZM21 29V31H26V29H21Z"
                fill="#7B809A"
              />
            </svg>
          </a>
          <!-- </button> -->
          <div class="flex flex-col justify-center break-words messageDetails">
            <Typography
              variant="heading-2"
              :no-color="true"
              class="messagefilename mb-3"
              :class="props.self ? ['text-black '] : ['text-black']"
            >
              {{
                props.isMobile === true
                  ? shorten(props.message?.media_files?.name || "", 8)
                  : props.message?.media_files?.name
              }}
            </Typography>

            <Typography
              class="flex messagefilesize"
              variant="body-2"
              :no-color="true"
              :class="props.self ? ['text-[#7B809A]'] : ['text-[#7B809A]']"
            >
              {{ convertFileSize(props.message?.media_files?.size) }}
            </Typography>
            <div class="flex justify-end items-end mx-auto">
              <div class="flex items-center absolute right-[-68%] top-[76%]">
                <!-- Contextmenu Icon -->
                <div v-if="showSVG">
                  <span
                    class="absolute w-[300px] z-9999"
                    @click="props?.handleOpenContextMenu"
                  >
                    <img
                      src="/svg/ContextMenuIcon.svg"
                      alt="context icon"
                      :class="
                        props.self
                          ? 'mt-[-65px] ml-[45px]'
                          : 'mt-[-70px] ml-[10px]'
                      "
                    />
                  </span>
                </div>
                <sub>
                  <!--date-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="mt-2"
                  >
                    <Typography
                      variant="body-1"
                      class="whitespace-pre text-[#7B809A]"
                      style="font-size: smaller"
                    >
                      {{ messageDateAndTime }}
                    </Typography>
                  </div>
                </sub>
                <sub>
                  <!--read receipt-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !== 'The message has been removed'
                    "
                    class="right-[-70%]"
                  >
                    <Receipt v-if="props.self" :state="props.message?.status" />
                  </div>
                </sub>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- audio -->
      <div
        v-if="
          props.message?.media_files?.type === 'audio' &&
          props.message?.content != 'The message has been removed'
        "
        class="relative py-[-20px]"
        :class="{
          'rounded-l order-2 bg-[#FFF4EA] ':
            (props.self || !props.self) &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
          'rounded-r order-2 bg-white':
            !props.self &&
            !props.selected &&
            !props.previous &&
            props.next &&
            props.message?.media_files,
        }"
      >
        <div v-if="props.message?.media_files?.name === 'voice_loading'">
          <Recording
            :recording="props.message?.media_files"
            :self="props.self"
            :loader="props.message?.media_files?.name === 'voice_loading'"
          />
        </div>
        <div v-else>
          <Recording
            :recording="props.message?.media_files"
            :self="props.self"
            :loader="props.message?.media_files?.name === 'voice_loading'"
          />
          <div class="flex justify-end items-end">
            <div class="flex items-center absolute top-[60%]">
              <!-- Contextmenu Icon -->
              <div v-if="showSVG">
                <span
                  class="absolute w-[300px] z-9999"
                  @click="props?.handleOpenContextMenu"
                >
                  <img
                    src="/svg/ContextMenuIcon.svg"
                    alt="context icon"
                    :class="
                      props.self
                        ? 'mt-[-46px] ml-[45px]'
                        : 'mt-[-50px] ml-[27px]'
                    "
                  />
                </span>
              </div>
              <sub>
                <!--date-->
                <div
                  v-if="
                    !Array.isArray(props.message) &&
                    props.message?.content !== 'The message has been removed'
                  "
                  class="mt-2"
                >
                  <Typography
                    variant="body-1"
                    class="whitespace-pre text-[#7B809A]"
                    style="font-size: smaller"
                  >
                    {{ messageDateAndTime }}
                  </Typography>
                </div>
              </sub>
              <sub>
                <!--read receipt-->
                <div
                  v-if="
                    !Array.isArray(props.message) &&
                    props.message?.content !== 'The message has been removed'
                  "
                  class="right-[-70%]"
                >
                  <Receipt v-if="props.self" :state="props.message?.status" />
                </div>
              </sub>
            </div>
          </div>
        </div>
      </div>

      <Carousel
        :message="props.message"
        :mediaGroup="props.mediaGroup"
        :open="openCarousel"
        :starting-id="selectedAttachmentId as number"
        :close-carousel="closeCarousel"
      />
    </div>
  </div>
</template>

<style scoped>
audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-panel {
  background-color: #fff4ea;
}

.mycolor::-webkit-media-controls-panel,
.mycolor::-webkit-media-controls-play-button {
  background-color: #00ab89;
}

.relative-container {
  position: relative;
}

.zoom-button {
  position: absolute;
  top: -20%;
  right: -2%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  background: none;
  border: none;
  z-index: 1;
}

.zoom-button:hover {
  opacity: 0.8;
}

@media (min-width: 215px) {
  .messageDetails {
    width: 60%;
  }
  .messagefilename {
    margin-bottom: 0% !important;
  }
  .messagefilesize {
    margin-bottom: 12%;
  }
}
@media (min-width: 255px) {
  .messageDetails {
    width: 68%;
  }
  .messageDateTime {
    left: -63%;
  }
}
@media (min-width: 270px) {
  .messageDateTime {
    left: -40%;
  }
  .messageReadReceipt {
    right: -63%;
  }
}
@media (min-width: 320px) {
  .messageDetails {
    width: 75%;
  }
  .messageDateTime {
    left: 0%;
  }
}
@media (min-width: 663px) {
  .messageDateTime {
    left: 70%;
  }
}
@media (min-width: 919px) {
  .messageDateTime {
    left: -50%;
  }
}
.progress {
  height: 5px;
  background-color: #e7dcd2;
  border-bottom-left-radius: 150px 20px;
  overflow: hidden;
  margin-left: 10px;
  width: 100%;
  margin-bottom: -2px;
}
.progress-bar {
  height: 100%;
  background-color: #00ab89;
}
</style>
