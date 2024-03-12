<script setup lang="ts">
import EmojiPanel from "@src/components/EmojiPanel.vue";
import SpecificEmoji from "@src/components/SpecificEmoji.vue";
import NoMessage from "@src/components/states/empty-states/NoMessage.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import Attachments from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Attachments.vue";
import MessageContextMenu from "@src/components/views/HomeView/Chat/ChatMiddle/Message/MessageContextMenu.vue";
import Receipt from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Receipt.vue";
import MessageReply from "@src/components/views/HomeView/Chat/MessageReply.vue";
import useStore from "@src/store/store";
import type { ChatMessages } from "@src/types";
import { shorten } from "@src/utils";
import linkifyStr from "linkify-string";
import type { Ref } from "vue";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
} from "vue";

const store = useStore();
const props = defineProps<{
  message?: ChatMessages | ChatMessages[];
  isFirst: boolean;
  self?: boolean;
  divider?: boolean;
  selected?: boolean;
  previous?: boolean;
  next?: boolean;
  handleSelectMessage?: (messageId: number) => void;
  handleDeselectMessage?: (messageId: number) => void;
  mediaGroup?: ChatMessages;
  loading?: Boolean;
}>();

const showContextMenu = ref(false);
const showEmojiPanel = ref(false);
let messageDateAndTime: Ref<string | undefined> = ref(
  !Array.isArray(props.message) && props?.message?.date
    ? props?.message?.date
    : "",
);
const contextMenuCoordinations: Ref<{ x: number; y: number }> = ref({
  x: 0,
  y: 0,
});
const selectedMessageId = ref(null);
const computedBackgroundColor = ref("inherit");
const panelRef: Ref<HTMLElement | null> = ref(null);
const messageBoxWidth: Ref<number> = ref(window.innerWidth);
// closes the context menu
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// Function to open the panel
const handleOpenEmojiPanel = () => {
  showEmojiPanel.value = !showEmojiPanel.value;
  if (!Array.isArray(props.message)) {
    store.singleMsg = props.message;
  }
};

const closePanelOnOutsideClick = (event: MouseEvent) => {
  if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
    showEmojiPanel.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closePanelOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closePanelOnOutsideClick);
});

// close context menu when opening a new one.
const contextConfig = {
  handler: handleCloseContextMenu,
  events: ["contextmenu"],
};

// close emoji panel
const closePanel = {
  handler: handleCloseEmojiPanel,
  events: ["contextmenu"],
};

function handleCloseEmojiPanel() {
  showEmojiPanel.value = false;
}

const showSVG = ref(false);
const showEmojiButton = ref(false);

function handleOpenContextMenu(event: MouseEvent) {
  showContextMenu.value = true;

  const menuWidth = ref(220);
  const menuHeight = ref(300);

  const maxX = window.innerWidth - menuWidth.value;
  const maxY = window.innerHeight - menuHeight.value;
  if (window.screen.availWidth <= 768) {
    contextMenuCoordinations.value = {
      x: event.pageX > maxX ? maxX - 15 : event.pageX - 15,
      y: event.pageY > maxY ? maxY - 60 : event.pageY - 60,
    };
  } else {
    contextMenuCoordinations.value = {
      x: event.pageX > maxX ? maxX : event.pageX,
      y: event.pageY > maxY ? maxY : event.pageY,
    };
  }
}

function handleMouseOver() {
  if (!props.self) {
    showSVG.value = true;
  }

  if (props.self) {
    showSVG.value = true;
  }

  if (
    !Array.isArray(props.message) &&
    props.message?.content === "The message has been removed"
  ) {
    showSVG.value = false;
  }
}

function handleMouseLeave() {
  if (!props.self) {
    showSVG.value = false;
  }
  if (props.self) {
    showSVG.value = false;
  }
}
// Function to close the panel when clicking on any emoji
const handleEmojiClick = () => {
  handleCloseEmojiPanel();
};

// Add event listener to the emoji container (replace 'emojiContainer' with the actual element or selector)
const emojiContainer = document.querySelector(".emoji-panel"); // Replace with the correct selector
emojiContainer?.addEventListener("click", handleEmojiClick);

function handleClickSelect() {
  if (!Array.isArray(props.message)) {
    if (props?.selected) {
      props?.handleDeselectMessage?.(props.message?.id ?? 0);
    } else {
      props?.handleSelectMessage?.(props.message?.id ?? 0);
    }
  } else {
    props.message.map((message) => {
      const messageFounded = store.selectedMessages.find(
        (isSelectedMessage: any) => {
          return isSelectedMessage == message.id ?? 0 ? true : false;
        },
      );
      if (messageFounded) {
        props?.handleDeselectMessage?.(message?.id ?? 0);
      } else {
        props?.handleSelectMessage?.(message?.id ?? 0);
      }
    });
  }
}

// Update the Message times
setInterval(() => {
  messageDateAndTime.value =
    !Array.isArray(props.message) && props.message?.message_time
      ? store.messageSentTime(props.message?.message_time?.toString())
      : "";
}, 60000); // Update every 60 seconds

const messageContent = ref(
  !Array.isArray(props.message) && props.message && props.message.content,
);
const isMobile = ref(window.innerWidth < 919);

const updateWindowSize = () => {
  isMobile.value = window.innerWidth <= 215;
};

onUpdated(() => {
  window.addEventListener("resize", updateWindowSize);
  messageBoxWidth.value = window.innerWidth;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowSize);
});

// Computed properties for style and class bindings
const borderRadiusStyle = computed(() => {
  if (props.message && !Array.isArray(props.message)) {
    return {
      borderRadius: isMobile.value
        ? messageContent.value && messageContent.value.length > 20
          ? "15px"
          : ""
        : messageContent.value && messageContent.value.length > 250
        ? "15px"
        : "",
      backgroundColor:
        props.message.content === "The message has been removed"
          ? "#F8F9FA"
          : "",
      fontStyle:
        props.message.content === "The message has been removed"
          ? "italic"
          : "normal",
      maxWidth:
        messageBoxWidth.value <= 663
          ? messageBoxWidth + "px"
          : props.message?.media_files?.type == "geographical"
          ? props.self
            ? "75%"
            : "250px"
          : "500px",
      paddingBottom:
        (!Array.isArray(props.message) &&
          props.message?.media_files?.name?.endsWith(".avi") &&
          "8px") ||
        undefined,
      padding: isMobile.value ? "10px" : "",
      border:
        props.message.content === "The message has been removed" ? "0" : "",
    };
  }
  return {};
});

const messageStyleClasses = computed(() => {
  return {
    "rounded-br  order-2 bg-[#FFF4EA]":
      props.self && !props.selected && !props.previous && props.next,

    "rounded-tr  order-2 bg-[#FFF4EA]":
      props.self && !props.selected && props.previous && !props.next,

    "rounded-r-none  order-2 bg-[#FFF4EA] ":
      props.self && !props.selected && props.previous && props.next,

    "rounded-bl order-2 bg-white":
      !props.self &&
      !props.selected &&
      !props.previous &&
      props.next &&
      !Array.isArray(props.message) &&
      props.message?.content,

    "rounded-tl  order-2 bg-white":
      !props.self &&
      !props.selected &&
      props.previous &&
      !props.next &&
      !Array.isArray(props.message) &&
      props.message?.content,

    "rounded-l-none  order-2 bg-white":
      !props.self &&
      !props.selected &&
      props.previous &&
      props.next &&
      !Array.isArray(props.message) &&
      props.message?.content,

    "rounded-bl  order-2  bg-[#00AB8966]":
      !props.self && props.selected && !props.previous && props.next,

    "rounded-tl  order-2  bg-[#00AB8966]":
      !props.self && props.selected && props.previous && !props.next,

    "rounded-l-none  order-2  bg-[#00AB8966]":
      !props.self &&
      props.selected &&
      props.previous &&
      props.next &&
      !Array.isArray(props.message) &&
      props.message?.content,

    "rounded  order-2  bg-[#00AB8966]":
      !props.self && props.selected && !props.previous && !props.next,

    "rounded-l-none  order-2 bg-transparent py-1":
      !props.self &&
      !Array.isArray(props.message) &&
      !props.message?.content &&
      (props.message?.media_files?.type === "image" ||
        (props.message?.media_files?.name ?? "").endsWith(".webp") ||
        props.message?.media_files?.type === "doc" ||
        props.message?.media_files?.type === "video" ||
        props.message?.media_files?.type === "geographical" ||
        (props.message?.media_files?.name ?? "").endsWith(".avi")),

    "rounded-r-none  order-2  bg-[#FFF4EA] border-[#E7DCD2]":
      props.self &&
      !Array.isArray(props.message) &&
      !props.message?.content &&
      !props.selected,

    "rounded-l-full bg-[#FFF4EA] py-1":
      props.self &&
      !Array.isArray(props.message) &&
      (props.message?.media_files?.type === "audio" ||
        props.message?.media_files?.type === "doc" ||
        props.message?.media_files?.type === "geographical" ||
        (props.message?.media_files?.name ?? "").endsWith(".avi")) &&
      !props.selected,

    "rounded-r-full rounded-l-none pl-0 bg-white py-1 pr-6":
      !props.self &&
      !Array.isArray(props.message) &&
      (props.message?.media_files?.type === "audio" ||
        props.message?.media_files?.type === "doc" ||
        props.message?.media_files?.type === "geographical" ||
        (props.message?.media_files?.name ?? "").endsWith(".avi")) &&
      !props.selected,

    "rounded-r-full rounded-l-none pl-0 bg-[#00AB8966] py-1 pr-6":
      !props.self &&
      !Array.isArray(props.message) &&
      (props.message?.media_files?.type === "audio" ||
        props.message?.media_files?.type === "doc" ||
        props.message?.media_files?.type === "geographical" ||
        (props.message?.media_files?.name ?? "").endsWith(".avi")) &&
      props.selected,

    "rounded-r-none bg-[#00AB8966] py-1":
      props.self &&
      !Array.isArray(props.message) &&
      (props.message?.media_files?.type === "audio" ||
        props.message?.media_files?.type === "doc" ||
        props.message?.media_files?.type === "video" ||
        props.message?.media_files?.type === "geographical" ||
        (props.message?.media_files?.name ?? "").endsWith(".avi")) &&
      props.selected,

    "rounded-r-none border-none order-2 bg-transparent border-0 ps-0 pe-0 py-1":
      !Array.isArray(props.message) &&
      !props.message?.content &&
      (props.message?.media_files?.type === "image" ||
        (props.message?.media_files?.name ?? "").endsWith(".webp") ||
        (props.message?.media_files?.type === "video" &&
          !(props.message?.media_files?.name ?? "").endsWith(".avi"))),

    "border-none order-2 bg-transparent ps-0 pe-0 py-2": Array.isArray(
      props.message,
    ),

    "rounded-r-none border-none order-2 bg-transparent ps-0 pe-0 py-2":
      props.self && Array.isArray(props.message),

    "rounded-r-none border-[#E7DCD2] order-2 bg-[#FFF4EA]":
      props.self &&
      !Array.isArray(props.message) &&
      props.message?.content &&
      !props.selected,

    "rounded-r-none order-2 bg-[#00AB8966]":
      props.self &&
      !Array.isArray(props.message) &&
      props.message?.content &&
      props.selected,

    "bg-[#fff]":
      !Array.isArray(props.message) &&
      props.message?.content &&
      !props.previous &&
      !props.next &&
      !props.self,
  };
});
const checkboxClasses = computed(() => {
  if (Array.isArray(props.message)) {
    return "flex";
  } else {
    return {
      hidden: props.message?.content === "The message has been removed",
      flex: props.message?.content !== "The message has been removed",
    };
  }
});

const processContent = (content: string) => {
  const shortenedContent = shorten(content, 765);
  const linkifiedContent = linkifyStr(shortenedContent, {
    className: props.self
      ? "text-[#027eb5] break-all"
      : "text-[#027eb5] break-all",
    format: {
      url: (content) =>
        content.length > 40 ? content.slice(0, 50) + "…" : content,
    },
  });

  if (store.inputSearch.length > 0) {
    return highlightMatchedContent(linkifiedContent);
  } else {
    const modifiedLinkifiedContent = linkifiedContent.replace(
      /<a /g,
      '<a target="_blank" ',
    );
    return modifiedLinkifiedContent;
  }
};

const highlightMatchedContent = (content: string) => {
  if (store.messages) {
    const filteredMessages = store.messages.filter((message) => {
      if (message.content) {
        return message.content.toLowerCase().includes(store.inputSearch);
      } else {
        console.log("No messages content ...");
      }
    });
    store.searchMessage = filteredMessages || [];
  }

  if (!content || !store.inputSearch) {
    return content;
  } else {
    const inputSearch = store.inputSearch.toLowerCase();
    const tempArr = inputSearch.split(" ");
    const highlightedContent = content
      .split(" ")
      .map((word) => {
        const wordLower = word.toLowerCase();
        const isMatch = tempArr.some((term: string) =>
          wordLower.includes(term),
        );

        return isMatch
          ? `<span style="background-color: #FFE815">${word}</span>`
          : word;
      })
      .join(" ");
    return highlightedContent;
  }
};
const getMessageId = (message: ChatMessages | ChatMessages[] | undefined) => {
  if (!Array.isArray(message) && message && "id" in message) {
    return message.id;
  }
};

const handleAllMessage = (messageId: number) => {
  store.searchMessage = [];
  store.inputSearch = "";
  if (!Array.isArray(props.message)) {
    computedBackgroundColor.value =
      selectedMessageId.value === props.message?.id ? "yellow" : "inherit";

    nextTick(() => {
      const element = document.getElementById(`messageContainer-${messageId}`);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }
};
const repliedMessage = ref<ChatMessages | null>(null);

if (props.message) {
  const messageArray = Array.isArray(props.message)
    ? props.message
    : [props.message];
  repliedMessage.value =
    store.messages.find(
      (message: ChatMessages) => message.id === messageArray[0]?.replyMessageId,
    ) || null;
}
</script>

<template>
  <div v-if="isFirst">
    <NoMessage vertical />
  </div>
  <div v-else class="select-none">
    <div
      class="flex items-center"
      :class="{
        'justify-end justify-between ': props.self,
        'justify-start': !props.self,
      }"
    >
      <div :class="{ 'mr-5': store.checkselectMessages }">
        <input
          v-if="store.checkselectMessages"
          type="checkbox"
          value=""
          v-model="props.selected"
          :class="checkboxClasses"
          @click="handleClickSelect"
          class="h-[16px] w-[16px] focus:ring-0 outline-none selectMessages"
        />
      </div>

      <div
        v-if="!$props.self && showEmojiPanel && store.singleMsg?.emoji"
        class=""
      >
        <SpecificEmoji :singleMessage="props.message" />
      </div>

      <div
        class="mb-1 flex flex-wrap max-[425px]:w-full"
        :class="{ 'justify-end': props.self }"
      >
        <div
          v-click-outside="contextConfig"
          :class="[
            repliedMessage
              ? 'group  p-4 rounded-full transition duration-500 border'
              : 'flex group p-4 rounded-full transition duration-500 border',
            (!Array.isArray(props.message) &&
              props.message?.media_files?.type == 'doc') ||
            (!Array.isArray(props.message) &&
              props.message?.media_files?.type === 'geographical') ||
            (!Array.isArray(props.message) &&
              props.message?.media_files?.name?.endsWith('.avi'))
              ? 'py-4 md:px-4 max-[425px]:w-full'
              : '',
            messageStyleClasses,
          ]"
          @mouseover="handleMouseOver"
          :id="'messageContainer-' + getMessageId(props.message)"
          @mouseleave="handleMouseLeave"
          :style="borderRadiusStyle"
        >
          <!--reply to-->
          <MessageReply
            v-if="
              !Array.isArray(props.message) &&
              props.message &&
              props.message?.content !== 'The message has been removed'
            "
            :message="props.message"
            :self="$props.self"
            :selected="props.selected"
            :id="'messageContainer-' + getMessageId(props.message)"
            class="mb-5 px-3"
          />

          <div class="flex justify-between w-full">
            <Typography
              variant="body-2"
              noColor
              v-if="
                !Array.isArray(props.message) &&
                props.message?.content == 'The message has been removed'
              "
              class="text-red-600"
              tabindex="0"
            >
            </Typography>

            <Typography
              variant="body-2"
              noColor
              v-if="
                !Array.isArray(props.message) &&
                props.message?.content &&
                !props.message?.messageEdited
              "
              class="outline-none text-[#343A40] text-start leading-5 text-[14px]"
              tabindex="0"
              @click="
                store.searchMessage?.length > 0
                  ? handleAllMessage(props.message.id)
                  : null
              "
              :class="[
                store.isReply ? 'mt-[30px] ml-[-31px]' : '',
                repliedMessage ? 'px-5' : '',
              ]"
            >
              <p
                v-html="processContent(props.message?.content)"
                class="max-w-[200px] lg:max-w-full"
              ></p>
            </Typography>

            <Typography
              variant="body-2"
              noColor
              v-if="
                !Array.isArray(props.message) && props.message?.messageEdited
              "
              class="outline-none text-[#343A40] text-start leading-5 text-[14px]"
              :class="[
                store.isReply ? 'mt-[30px] ml-[-31px]' : '',
                repliedMessage ? 'px-5' : '',
              ]"
              tabindex="0"
              @click="
                store.searchMessage?.length > 0
                  ? handleAllMessage(props.message.id)
                  : null
              "
            >
              <p
                v-html="processContent(props.message?.messageEdited)"
                class="max-w-[200px] lg:max-w-full"
              ></p>
            </Typography>

            <div
              v-else
              :class="
                !Array.isArray(props.message) && props.message?.content
                  ? ''
                  : 'w-full'
              "
            >
              <!--attachments-->
              <Attachments
                v-if="Array.isArray(props.message)"
                :mediaGroup="props.message"
                :self="props.self"
                :selected="props.selected"
                :previous="props.previous"
                :next="props.next"
                :handleOpenContextMenu="handleOpenContextMenu"
                :isMobile="isMobile"
                :showSVG="showSVG"
              />

              <Attachments
                v-else-if="props.message?.media_files"
                :message="props.message"
                :self="props.self"
                :selected="props.selected"
                :previous="props.previous"
                :next="props.next"
                :handleOpenContextMenu="handleOpenContextMenu"
                :isMobile="isMobile"
                :showSVG="showSVG"
              />
            </div>

            <!-- Edited msg  -->
            <div
              class="flex justify-end"
              v-if="
                !Array.isArray(props.message) &&
                props.message?.content != 'The message has been removed'
              "
            >
              <sub class="">
                <div v-if="props.message?.messageEdited" class="absolute top-4">
                  <Typography
                    variant="body-1"
                    class="whitespace-pre text-[#7B809A]"
                    style="font-size: smaller"
                  >
                    Edited
                  </Typography>
                </div>
              </sub>
            </div>
            <div class="flex justify-end">
              <div class="flex justify-end items-end">
                <sub class="top-[10px]">
                  <!--date-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !==
                        'The message has been removed' &&
                      props.message?.media_files?.type != 'geographical' &&
                      props.message?.media_files?.type != 'doc' &&
                      !props.message?.media_files?.name?.endsWith('.avi') &&
                      props.message?.media_files?.type != 'audio'
                    "
                    :class="[
                      !Array.isArray(props.message) &&
                      (props.message?.media_files?.type === 'image' ||
                        props.message?.media_files?.name?.endsWith('.webp') ||
                        (props.message?.media_files?.type === 'video' &&
                          !props.message?.media_files?.name?.endsWith('.avi')))
                        ? 'absolute bottom-[15px] right-[40px]'
                        : 'mt-2 ml-3',
                      props.self ? 'mr-2 order-1' : 'mr-5',
                      props.message?.media_files?.type === 'video' &&
                      !props.message?.media_files?.name?.endsWith('.avi')
                        ? 'absolute right-[20px]'
                        : '',
                      props.message?.media_files?.type === 'audio'
                        ? 'absolute bottom-[2px] right-[20px]'
                        : '',
                    ]"
                  >
                    <Typography
                      variant="body-1"
                      class="whitespace-pre"
                      :class="[
                        !Array.isArray(props.message) &&
                        (props.message?.media_files?.type === 'image' ||
                          props.message?.media_files?.name?.endsWith('.webp') ||
                          (props.message?.media_files?.type === 'video' &&
                            !props.message?.media_files?.name?.endsWith(
                              '.avi',
                            )))
                          ? 'text-white'
                          : 'text-[#7B809A]',
                      ]"
                      style="font-size: smaller"
                    >
                      {{ messageDateAndTime }}
                    </Typography>
                  </div>
                </sub>
              </div>

              <div
                :class="[
                  !Array.isArray(props.message) &&
                  (props.message?.media_files?.type === 'image' ||
                    props.message?.media_files?.name?.endsWith('.webp') ||
                    (props.message?.media_files?.type === 'video' &&
                      !props.message?.media_files?.name?.endsWith('.avi')))
                    ? 'mt-[106px] ml-[-20px] left-[-40px]'
                    : 'flex items-end ',
                  !Array.isArray(props.message) &&
                  (props.message?.media_files?.type === 'audio' ||
                    (props.message?.media_files?.type === 'video' &&
                      !props.message?.media_files?.name?.endsWith('.avi')))
                    ? 'mt-[38px] ml-[-20px]'
                    : '',
                ]"
              >
                <sub
                  :class="[
                    !Array.isArray(props.message) &&
                    (props.message?.media_files?.type === 'image' ||
                      props.message?.media_files?.name?.endsWith('.webp') ||
                      (props.message?.media_files?.type === 'video' &&
                        !props.message?.media_files?.name?.endsWith('.avi')))
                      ? ' left-[-15px]'
                      : 'top-[10px]',
                    !Array.isArray(props.message) &&
                    (props.message?.media_files?.type === 'doc' ||
                      props.message?.media_files?.type === 'geographical' ||
                      props.message?.media_files?.name?.endsWith('.avi'))
                      ? 'left-[2px]'
                      : 'top-[10px]',
                  ]"
                >
                  <!--read receipt-->
                  <div
                    v-if="
                      !Array.isArray(props.message) &&
                      props.message?.content !==
                        'The message has been removed' &&
                      props.message?.media_files?.type != 'geographical' &&
                      props.message?.media_files?.type != 'doc' &&
                      !props.message?.media_files?.name?.endsWith('.avi') &&
                      props.message?.media_files?.type != 'audio'
                    "
                    :class="[
                      !Array.isArray(props.message) &&
                      (props.message?.media_files?.type === 'image' ||
                        props.message?.media_files?.name?.endsWith('.webp'))
                        ? 'mt-[110px] min-[215px]:mt-[42px] min-[250px]:mt-[82px] min-[270px]:mt-[98px] min-[320px]:mt-[114px]'
                        : '',

                      !Array.isArray(props.message) &&
                      props.message?.media_files?.type === 'video' &&
                      !props.message?.media_files?.name?.endsWith('.avi')
                        ? 'min-[215px]:mt-[32px] min-[250px]:mt-[54px] min-[270px]:mt-[62px] min-[309px]:mt-[85px] min-[320px]:mt-[90px] min-[663px]:mt-[110px]'
                        : '',

                      !Array.isArray(props.message) &&
                      props.message?.content &&
                      props.message?.content.length > 100
                        ? 'mt-8'
                        : '',
                    ]"
                  >
                    <Receipt v-if="props.self" :state="props.message?.status" />
                  </div>

                  <!-- ContextMenu icon -->
                  <span
                    v-if="
                      showSVG &&
                      !Array.isArray(props.message) &&
                      props.message?.media_files?.type != 'geographical' &&
                      props.message?.media_files?.type != 'doc' &&
                      !props.message?.media_files?.name?.endsWith('.avi') &&
                      props.message?.media_files?.type != 'audio'
                    "
                    class="absolute w-[300px] z-9999"
                    @click="handleOpenContextMenu"
                    :class="{
                      'ml-[-20px] mt-[-44px] ':
                        !props.self && props.message?.content,

                      'mt-[-190px] max-[255px]:mt-[-155px] max-[270px]:mt-[-170px]':
                        props.self &&
                        !Array.isArray(props.message) &&
                        props.message?.media_files?.type === 'image',

                      'mt-[-215px] ml-[-20px] max-[255px]:mt-[-182px] max-[270px]:mt-[-198px]':
                        !props.self &&
                        !Array.isArray(props.message) &&
                        props.message?.media_files?.type === 'image',

                      'mt-[-125px] ml-[-10px] max-[255px]:mt-[-70px] max-[270px]:mt-[-70px]':
                        props.self &&
                        !Array.isArray(props.message) &&
                        props.message?.media_files?.type === 'video',

                      'mt-[-150px] ml-[-20px] max-[255px]:mt-[-100px] max-[270px]:mt-[-100px]':
                        !props.self &&
                        !Array.isArray(props.message) &&
                        props.message?.media_files?.type === 'video',

                      'mt-[-25px]':
                        props.self &&
                        !Array.isArray(props.message) &&
                        props.message?.media_files?.type === 'audio',
                    }"
                  >
                    <img
                      src="/svg/ContextMenuIcon.svg"
                      alt="context icon"
                      :class="props.self ? 'mt-[-40px]' : 'mr-[0px]'"
                    />
                  </span>

                  <!-- emoji panel -->
                  <div v-click-outside="closePanel">
                    <span
                      title="toggle emoji picker"
                      aria-label="toggle emoji picker"
                      v-if="showEmojiButton"
                      class="absolute w-[300px] z-9999 cursor-pointer"
                      @click="handleOpenEmojiPanel"
                    >
                      <img
                        src="/svg/EmojiIcon.svg"
                        alt="Network error"
                        class="mt-[-10px] mx-6"
                      />
                    </span>
                    <div
                      v-if="showEmojiPanel"
                      class="emoji-panel absolute z-10 bottom-[25px] md:right-0 xs:right-[-80px] lg:right-[-80px] mt-2"
                    >
                      <EmojiPanel
                        :show="showEmojiPanel"
                        :close-emoji="closePanel"
                        :handleCloseEmojiPanel="handleCloseEmojiPanel"
                      />
                    </div>
                  </div>
                </sub>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <MessageContextMenu
    v-if="
      showContextMenu &&
      (Array.isArray(props.message)
        ? props.message.every((msg) => !msg.hasTemporaryId)
        : !props.message?.hasTemporaryId)
    "
    :selected="props.selected"
    :message="props.message"
    :show="showContextMenu"
    :left="contextMenuCoordinations.x"
    :top="contextMenuCoordinations.y"
    :handle-close-context-menu="handleCloseContextMenu"
    :handle-select-message="handleSelectMessage"
    :handle-deselect-message="handleDeselectMessage"
    :showContextMenu="showContextMenu"
    :isSelf="$props.self"
  />
</template>

<style scoped>
.selectMessages {
  width: 18px;
  height: 18px;
  outline: none;
  border-radius: 4px;
}

.selectMessages:checked {
  position: relative;
  -webkit-appearance: none;
  background-color: #00ab89;
  border: 2px solid #00ab89;
  border-radius: 4px;
  outline: none;
}

.selectMessages::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  display: none;
  outline: none;
}

.selectMessages:checked::before {
  display: block;
}

.selectMessages:checked::after {
  display: block;
}

.selectMessages:focus {
  outline: none;
}
</style>
