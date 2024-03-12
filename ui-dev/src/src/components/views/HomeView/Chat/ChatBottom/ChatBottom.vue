<script setup lang="ts">
import {
  CheckIcon,
  MicrophoneIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import Loading1 from "@src/components/states/loading-states/Loading1.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import Button from "@src/components/ui/inputs/Button.vue";
import EmojiPicker from "@src/components/ui/inputs/EmojiPicker/EmojiPicker.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Textarea from "@src/components/ui/inputs/Textarea.vue";
import ReplyMessage from "@src/components/views/HomeView/Chat/ChatBottom/ReplyMessage.vue";
import { postData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
import type { ChatMessages, IConversation } from "@src/types";
import { getConversationIndex, getLatestConversationTop } from "@src/utils";
import axios from "axios";
import type { Ref } from "vue";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { POSITION, useToast } from "vue-toastification";

const toast = useToast();
const props = defineProps<{
  handleCloseSelect?: () => void;
}>();
const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const MessageUrl = `${ApiBaseUrl}/api/v1/messages`;
const EditMessageUrl = `${ApiBaseUrl}/api/v1/update-message`;
const recording = ref(false);
const store = useStore();
const activeConversation = <IConversation>inject("activeConversation");
const { postAllData, farmerList } = postData();
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const stream = ref<MediaStream | null>(null);
const timer = ref<number>(0);
const intervalId = ref<NodeJS.Timeout | null>(null);

// the content of the message.
const value: Ref<string> = ref("");
const messageStatus = "Waiting";

// open emoji picker.
const showPicker = ref(false);

// scroll message div to bottom
const scrollToBottom = () => {
  if (store.messageContainer) {
    store.messageContainer?.scrollTo({
      top: store.messageContainer?.scrollHeight,
    });
  }
};

// Function to open the panel
const handleOpenPanel = () => {
  if (!showPicker.value) {
    showPicker.value = true;
    document.addEventListener("click", closePanelOnClickOutside);
  } else {
    showPicker.value = false;
    document.removeEventListener("click", closePanelOnClickOutside);
  }
};

// Function to close the panel when clicking outside
const closePanelOnClickOutside = (event: any) => {
  const emojiPanel = document.querySelector(".emoji-panel");
  if (emojiPanel && !emojiPanel.contains(event.target)) {
    showPicker.value = false;
    document.removeEventListener("click", closePanelOnClickOutside);
  }
};
onBeforeUnmount(() => {
  document.removeEventListener("click", closePanelOnClickOutside);
});

// (event) set the draft message equals the content of the text area
const handleSetDraft = () => {
  const index = getConversationIndex(activeConversation.id);
  if (index !== undefined) {
    store.conversations[index].draftMessage = value.value;
  }
};

const handleToggleRecording = () => {
  // Record audio
  recording.value = !recording.value;
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((userStream: MediaStream) => {
        stream.value = userStream;
        mediaRecorder.value = new MediaRecorder(userStream);

        mediaRecorder.value.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // audioChunks.value = event.data;
            audioChunks.value.push(event.data);
            handleSendRecording();
          }
        };
        if (intervalId.value) {
          clearInterval(intervalId.value);
        }
        // Start a timer
        intervalId.value = setInterval(() => {
          timer.value += 1;
        }, 1000);

        mediaRecorder.value.start();
        recording.value = true;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  } else if (!window.isSecureContext) {
    alert(
      "This application needs to run in a secure context. Please serve it over HTTPS or from localhost for development.",
    );
    return;
  } else {
    console.error("navigator.mediaDevices is not supported on this browser.");
  }
};

const formattedTimer = computed(() => {
  const hours = Math.floor(timer.value / 3600);
  const minutes = Math.floor((timer.value % 3600) / 60);
  const seconds = timer.value % 60;
  if (hours) {
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  } else {
    return `${padZero(minutes)}:${padZero(seconds)}`;
  }
});

const padZero = (num: number) => {
  return num.toString().padStart(2, "0");
};

const handleCancelRecording = () => {
  stream.value?.getAudioTracks()[0].stop();

  if (mediaRecorder.value) {
    mediaRecorder.value.stop();

    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  }
};

function handleSendRecording() {
  handleCancelRecording();
  if (audioChunks.value?.length > 0 && recording.value === true) {
    const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const voicenoteUrl = `${ApiBaseUrl}/api/v1/save-voice_note`;
    const senderId = store.loginUserList?.id?.toString() || "";
    const receiverId = store.activeReceiverId?.toString() || "";
    const consulatationId = store.activeConversationId?.toString() || "";
    const replyMessage = store.singleMsg?.id?.toString() || "";
    const duration = formattedTimer.value || "";

    store.MessageTempDetails?.push({
      id:  Date.now() + Math.floor(Math.random() * 1000),
    });

    const newMessage: ChatMessages = {
      id: store.MessageTempDetails[store.MessageTempDetails.length - 1].id,
      media_files: {
        type: "audio",
        path: "test",
        thumb_path: "test",
        name: "voice_loading",
        size: "100Kb",
        id: 0,
        created_at: new Date(),
        isMediaDelete: false,
      },
      content: "",
      message_time: new Date(),
      date: store.messageSentTime(new Date()),
      status: messageStatus,
      sender_id: store.loginUserList ? store.loginUserList.id : 0,
      loading: false,
      hasTemporaryId: true,
    };
    // Push the newMessage into the messages array
    if (store.singleMsg && store.singleMsg.id) {
      newMessage.replyMessageId = store.singleMsg.id;
    }
    store.messages.push(newMessage);

    const formData = new FormData();
    audioChunks.value.forEach((chunk) => {
      formData.append("sender_id", senderId);
      formData.append("receiver_id", receiverId);
      formData.append("consultation_id", consulatationId);
      formData.append("audio", chunk);
      formData.append("duration", duration);
      formData.append("replay_message_id", replyMessage);
    });

    axios({
      method: "post",
      url: voicenoteUrl,
      data: formData,
      headers: { "content-type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
    timer.value = 0;
  }
  recording.value = false;

  audioChunks.value = [];
  getLatestConversationTop(store.lastMessage, store.activeConversationId);
}

function handleStopRecording() {
  handleCancelRecording();
  recording.value = false;
  timer.value = 0;
}
const sendMessage = async () => {
  let messageStatus = "Waiting";
  if (store.inputValue.trim().length === 0) {
    toast.info("Please type a message to continue", {
      timeout: 3000,
      position: POSITION.TOP_CENTER,
      hideProgressBar: true,
      closeButton: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  } else {
    if (store.isEdit === false) {
      store.MessageTempDetails?.push({
        id: new Date().getTime(),
      });

      const newMessage: ChatMessages = {
        id: store.MessageTempDetails[store.MessageTempDetails?.length - 1].id,
        messageEdited: "",
        content: store.inputValue,
        message_time: new Date(),
        date: store.messageSentTime(new Date()),
        status: messageStatus,
        sender_id: store.loginUserList ? store.loginUserList.id : 0,
        loading: false,
        hasTemporaryId: true,
        loadingPercent: store.fileUploadPercent,
      };
      // Push the newMessage into the messages array
      if (store.singleMsg && store.singleMsg.id) {
        newMessage.replyMessageId = store.singleMsg.id;
      }
      store.messages.push(newMessage);
    }
    if (store.messageContainer) {
      store.messageContainer?.scrollTo({
        top: store.messageContainer?.scrollHeight,
      });
    }

    if (store.isEdit === true) {
      const EditMessageData = reactive({
        message_id: store.singleMsg?.id,
        message: store.inputValue,
        consultation_id: store.activeConversationId,
      });
      await postAllData(EditMessageUrl, EditMessageData);

      if (farmerList.value) {
        const a = store.messages?.findIndex(
          (e: ChatMessages) => e.id === store.singleMsg?.id,
        );

        if (a !== -1) {
          store.messages[a].messageEdited = store.inputValue;
          store.isEdit = false;
          props.handleCloseSelect && props.handleCloseSelect();
          store.checkselectMessages = false;
        }
      }
    } else {
      if (store.inputValue.length > 0) {
        fetch(MessageUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender_id: store.loginUserList?.id,
            receiver_id: store.activeReceiverId,
            consultation_id: store.activeConversationId,
            message: store.inputValue,
            status: messageStatus,
            replay_message_id: store.singleMsg?.id,
          }),
        });
      }
    }
    // resetting variables...
    store.isReply = false;
    store.singleMsg = null;
    store.inputValue = "";
    getLatestConversationTop(store.lastMessage, store.activeConversationId);
  }
};

onMounted(() => {
  value.value = activeConversation.draftMessage;
  store.inputValue = value.value;
});

function handleCloseEdit() {
  store.isEdit = false;
  store.inputValue = "";
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File[]>([]);
const FileUploadUrl = `${ApiBaseUrl}/api/v1/upload_chunk`;
const validFileTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/plain",
  "text/csv",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/vnd.google-earth.kmz", // KMZ
  "application/vnd.google-earth.kml+xml", // KML
  "video/mp4", // MP4
  "video/x-msvideo", // AVI
  "video/quicktime", // MOV
];
const additionalFileTypes = [".kmz", ".kml", ".doc", ".xls", ".avi", ".mov"];

const acceptAttribute = [...validFileTypes, ...additionalFileTypes]
  .map((type) => (type.includes("/") ? `.${type.split("/").pop()}` : type))
  .join(",");
const handleFileUpload = (event: Event) => {
  const inputElement = fileInputRef.value;
  if (inputElement && inputElement.files) {
    const files = Array.from(inputElement.files);

    if (files.length > 0) {
      if (!selectedFile.value) {
        selectedFile.value = [];
      }
      selectedFile.value?.push(...files);

      handleSendMedia();
    }
  }
};

const openFileInput = () => {
  scrollToBottom();
  fileInputRef.value?.click();
};

const uploadProgress = ref<number>(0);

const overallProgress = ref(0);
const fileType = ref("");

const handleSendMedia = async () => {
  if (selectedFile.value && selectedFile.value.length > 0) {
    overallProgress.value = 0;

    store.isLoading = true;
    const senderId = store.loginUserList?.id?.toString() || "";
    const receiverId = store.activeReceiverId?.toString() || "";
    const consulatationId = store.activeConversationId?.toString() || "";
    const replyMessage = store.singleMsg?.id?.toString() || "";
    const messageValue = value.value || "";

    const commonFormData = new FormData();
    commonFormData.append("sender_id", senderId);
    commonFormData.append("receiver_id", receiverId);
    commonFormData.append("consultation_id", consulatationId);
    commonFormData.append("message", messageValue);
    commonFormData.append("replay_message_id", replyMessage);

    const allowedFileTypes: { [key: string]: string[] } = {
      docs: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/plain",
        "text/csv",
      ],
      images: ["image/jpeg", "image/jpg", "image/png"],
      videos: ["video/mp4", "video/x-msvideo", "video/quicktime", "video/avi"],
      geographical: [
        "application/vnd.google-earth.kmz", // KMZ
        "application/vnd.google-earth.kml+xml", // KML
      ],
    };

    for (let i = 0; i < selectedFile.value.length; i++) {
      const currentFile = selectedFile.value[i];
      const fileCategory = Object.keys(allowedFileTypes).find((category) =>
        allowedFileTypes[category]
          .map((type) =>
            type.includes("/") ? `.${type.split("/").pop()}` : type,
          )
          .join(","),
      );
      Object.keys(allowedFileTypes).forEach((category) => {
        if (allowedFileTypes[category].includes(currentFile.type)) {
          fileType.value = category;
        } else if (currentFile.type === "") {
          // Extract extension from filename
          const extension = currentFile.name.split(".").pop()?.toLowerCase();
          if(extension) {
          fileType.value = extension;
          }
        }
      });
      if (!fileCategory) {
        console.log(
          `File ${currentFile.name} is not a valid PDF, DOCX, XLS, XLSX, TXT, or CSV file.`,
        );
        continue;
      }

      store.MessageTempDetails.push({
        id: Date.parse(new Date().toLocaleString()),
      });

      const newMessage: ChatMessages = {
        id: store.MessageTempDetails[store.MessageTempDetails.length - 1].id,
        media_files: {
          type: fileType.value,
          path: undefined,
          thumb_path: undefined,
          name: currentFile.name,
          size: currentFile.size.toString(),
          id: undefined,
          created_at: new Date(),
          duration: undefined,
          isMediaDelete: false,
          loadingPercent: "",
        },
        content: "",
        message_time: new Date(),
        date: store.messageSentTime(new Date()),
        status: messageStatus,
        sender_id: store.loginUserList ? store.loginUserList.id : 0,
        loading: false,
        hasTemporaryId: true,
      };
      // Push the newMessage into the messages array
      if (store.singleMsg && store.singleMsg.id) {
        newMessage.replyMessageId = store.singleMsg.id;
      }
      store.messages.push(newMessage);

      const fileExtension = currentFile.type;
      const chunkSize = 1024 * 1024;
      const totalChunks = Math.ceil(currentFile.size / chunkSize);

      for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, currentFile.size);
        const chunk = currentFile.slice(start, end);

        const formData = new FormData();
        for (const [key, value] of commonFormData.entries()) {
          formData.append(key, value);
        }
        formData.append("name_of_file", currentFile.name);
        formData.append("totalChunks", totalChunks.toString());
        formData.append("extension", fileExtension);
        formData.append("size", currentFile.size.toString());
        formData.append("file", chunk);
        formData.append("currentChunk", currentChunk.toString());

        // Calculate upload progress

        const desiredUploadSpeed = 100000;
        const uploadTime =
          (selectedFile.value[0]?.size / desiredUploadSpeed) * 1000;

        uploadProgress.value = 0;
        const interval = setInterval(() => {
          uploadProgress.value = Math.min(uploadProgress.value + 10, 100);
          store.fileUploadPercent = uploadProgress.value;

          const calculateLoadingPercent = store.messages?.find(
            (msg) =>
              msg.id ===
              store.MessageTempDetails[store.MessageTempDetails.length - 1].id,
          );
          if (calculateLoadingPercent?.media_files) {
            calculateLoadingPercent.media_files.loadingPercent =
              uploadProgress.value + "%";
          }
          if (uploadProgress.value === 100) {
            clearInterval(interval); // Clear interval when progress reaches 100%
          }
        }, uploadTime / 10);

        const timer = setTimeout(() => {
          clearInterval(interval);
        }, uploadTime);

        try {
          await axios.post(FileUploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (error) {
          store.isLoading = false;
          console.error("Error uploading chunk:", error);
        }
      }
    }
    value.value = "";
    selectedFile.value = [];
    store.isLoading = false;

    getLatestConversationTop(store.lastMessage, store.activeConversationId);
  }
};
watch(selectedFile, () => {
  overallProgress.value = 0;
});
</script>

<template>
  <div
    v-if="
      store.showEndChat === store.activeConversationId ||
      store.activeSidebarComponent === 'archived'
    "
  >
    <div
      class="h-auto p-5 bg-[#F8F9FA] text-[#7B809A]"
      v-if="store.status !== 'loading'"
      :class="recording ? ['justify-between'] : []"
    >
      <div class="mx-auto flex justify-center">
        <img src="/svg/Archive.svg" />
        <p class="mx-3 font-bold">Chat Ended</p>
      </div>

      <div class="w-[80%] mx-auto mt-3">
        <p class="text-center">
          You can no longer send messages in this chat as it has been concluded.
          If you have further questions or need assistance, please contact our
          support team.
        </p>
      </div>
    </div>
  </div>

  <div v-else class="w-full bg-[#F8F9FA] z-[9]">
    <!--selected reply display-->
    <div
      v-if="store.isReply"
      class="relative transition-all duration-200"
      :class="{ 'pt-[60px]': store.singleMsg }"
    >
      <ReplyMessage />
    </div>

    <div
      class="h-auto min-h-[84px] p-5 flex items-end"
      v-if="store.status !== 'loading'"
      :class="recording ? ['justify-between'] : []"
    >
      <div class="min-h-[44px]">
        <!--emojis-->

        <div v-if="!recording">
          <!--emoji button-->
          <IconButton
            title="toggle emoji picker"
            aria-label="toggle emoji picker"
            class="w-7 h-7 md:mr-5 xs:mr-4"
            @click.stop="handleOpenPanel()"
          >
            <XCircleIcon
              v-if="showPicker"
              class="w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"
            />

            <div
              v-else
              class="toggle-picker-button group w-[20px] h-[20px] text-gray-400 group-hover:text-indigo-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 6.47 17.5 2 12 2ZM12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20ZM13 9.94L14.06 11L15.12 9.94L16.18 11L17.24 9.94L15.12 7.82L13 9.94ZM8.88 9.94L9.94 11L11 9.94L8.88 7.82L6.76 9.94L7.82 11L8.88 9.94ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"
                  fill="#7B809A"
                />
              </svg>
            </div>
          </IconButton>

          <div
            v-show="showPicker"
            @click.stop
            class="emoji-panel absolute z-10 bottom-[75px] lg:left-[19%] mt-2"
          >
            <div role="none">
              <EmojiPicker :show="showPicker" />
            </div>
          </div>
        </div>

        <!--recording timer-->
        <Typography
          v-if="recording"
          variant="body-1"
          no-color
          class="text-[#00AB89]"
          >{{ formattedTimer }}</Typography
        >
      </div>

      <!--message textarea-->

      <div class="grow md:mr-5 xs:mr-4 self-end" v-if="!recording">
        <div class="relative">
          <Textarea
            v-model="store.inputValue"
            @input="handleSetDraft"
            :value="store.inputValue"
            @keydown.enter.exact.prevent="
              handleSetDraft();
              sendMessage();
            "
            class="max-h-[80px] pr-[50px] resize-none scrollbar-hidden text-black"
            auto-resize
            cols="30"
            rows="1"
            placeholder="Type a message"
            aria-label="Type a message"
            id="drag-drop-textarea"
          />

          <div
            class="absolute bottom-[13px] -right-2"
            v-if="store.isEdit === false"
          >
            <input
              id="file-upload"
              :accept="acceptAttribute"
              type="file"
              ref="fileInputRef"
              @change="handleFileUpload"
              style="display: none"
              multiple
            />

            <IconButton
              title="open select attachments modal"
              aria-label="open select attachments modal"
              v-if="!recording"
              class="group w-7 h-7 md:mr-5 xs:mr-4"
              @click="openFileInput"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.5 6V17.5C16.5 18.5609 16.0786 19.5783 15.3284 20.3284C14.5783 21.0786 13.5609 21.5 12.5 21.5C11.4391 21.5 10.4217 21.0786 9.67157 20.3284C8.92143 19.5783 8.5 18.5609 8.5 17.5V5C8.5 4.33696 8.76339 3.70107 9.23223 3.23223C9.70107 2.76339 10.337 2.5 11 2.5C11.663 2.5 12.2989 2.76339 12.7678 3.23223C13.2366 3.70107 13.5 4.33696 13.5 5V15.5C13.5 15.7652 13.3946 16.0196 13.2071 16.2071C13.0196 16.3946 12.7652 16.5 12.5 16.5C12.2348 16.5 11.9804 16.3946 11.7929 16.2071C11.6054 16.0196 11.5 15.7652 11.5 15.5V6H10V15.5C10 16.163 10.2634 16.7989 10.7322 17.2678C11.2011 17.7366 11.837 18 12.5 18C13.163 18 13.7989 17.7366 14.2678 17.2678C14.7366 16.7989 15 16.163 15 15.5V5C15 3.93913 14.5786 2.92172 13.8284 2.17157C13.0783 1.42143 12.0609 1 11 1C9.93913 1 8.92172 1.42143 8.17157 2.17157C7.42143 2.92172 7 3.93913 7 5V17.5C7 18.9587 7.57946 20.3576 8.61091 21.3891C9.64236 22.4205 11.0413 23 12.5 23C13.9587 23 15.3576 22.4205 16.3891 21.3891C17.4205 20.3576 18 18.9587 18 17.5V6H16.5Z"
                  fill="#7B809A"
                />
              </svg>
            </IconButton>
          </div>

          <div
            class="absolute bottom-[13px] right-6"
            v-if="store.isEdit === true && store.inputValue.length > 0"
            @click="handleCloseEdit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="#7B809A"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="min-h-[44px]">
        <!--cancel recording button-->
        <div v-if="recording">
          <Button
            variant="ghost"
            color="danger"
            @click="handleStopRecording"
            class=""
          >
            Cancel
          </Button>
        </div>
      </div>

      <div class="min-h-[44px] flex">
        <!--finish recording button-->
        <IconButton
          title="finish recording"
          aria-label="finish recording"
          v-if="recording && store.isEdit === false"
          @click="handleCancelRecording"
          class="relative group w-7 h-7 flex justify-center items-center outline-none rounded-full bg-[#00AB89] hover:bg-green-300 focus:outline-none transition-all duration-200"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AB89] group-hover:bg-green-300 opacity-40"
          >
          </span>

          <MicrophoneIcon
            class="w-[20px] h-[20px] text-white group-hover:hidden"
          />
          <CheckIcon
            class="w-[20px] h-[20px] hidden text-white group-hover:block"
          />
        </IconButton>

        <!--start recording button-->
        <IconButton
          v-else-if="store.isEdit === false"
          @click="handleToggleRecording"
          title="start recording"
          aria-label="start recording"
          class="group w-7 h-7 md:mr-5 xs:mr-4"
        >
          <img
            src="/svg/VoiceRecordIcon.svg"
            alt="Network error"
            class="mx-3"
          />
        </IconButton>

        <!--send message button-->

        <div
          v-if="!recording"
          class="flex items-center group w-7 h-7 cursor-pointer"
          variant="ghost"
          title="send message"
          aria-label="send message"
          @click="sendMessage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="#00AB89" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <Loading1
    v-if="store.status === 'loading' || store.delayLoading"
    v-for="item in 6"
  />
</template>

<style>
input[placeholder="Search emoji"] {
  background: rgba(0, 0, 0, 0);
}

.v3-emoji-picker .v3-header {
  border-bottom: 0;
}

.v3-emoji-picker .v3-footer {
  border-top: 0;
}

.Vue-Toastification__toast--info {
  background-color: #c0c0c0 !important;
}
</style>
