<script setup lang="ts">
import AttachmentBar from "@src/components/shared/modals/AttachmentsModal/AttachmentBar.vue";
import Message from "@src/components/views/HomeView/Chat/ChatMiddle/Message/Message.vue";
import Documents from "@src/components/views/HomeView/Chat/Media/Documents.vue";
import Links from "@src/components/views/HomeView/Chat/Media/Links.vue";
import Media from "@src/components/views/HomeView/Chat/Media/Media.vue";
import { putData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
import type {
  ChatMessages,
  DbMessage,
  LastMessage,
  MessageTempDetails,
  UserStatus,
  messageStatusUpdateData,
} from "@src/types";
import axios from "axios";
import Pusher from "pusher-js";
import type { Ref } from "vue";
import { onMounted, onUpdated, reactive, ref } from "vue";
import Loading3 from "@src/components/states/loading-states/Loading3.vue";

const props = defineProps<{
  handleSelectMessage: (messageId: number) => void;
  handleDeselectMessage: (messageId: number) => void;
  selectedMessages: number[];
}>();
const APIBaseUrl = import.meta.env.VITE_API_BASE_URL;
const { updateAllData, updateEntityDataStatus } = putData();
const store = useStore();
const messages = ref<ChatMessages[]>([]);
const container: Ref<HTMLElement | null> = ref(null);
const unMuteChatUrl = `${APIBaseUrl}/api/v1/conversations/unmute_notification`;
const muteChatData = reactive({ consultation_id: store.activeConversationId });

// checks whether the message is sent by the authenticated user.
const isSelf = (sender: number): boolean => {
  store.activeSender = sender;
  return Boolean(sender == store?.loginUserList?.id);
};

const isPrevious = (index: number) => {
  const currentMessage = messages.value[index];
  const nextMessage = messages.value[index + 1];

  if (Array.isArray(messages.value)) {
    if (index != 0) {
      if (
        messages.value[index + 1]?.sender_id == messages.value[index].sender_id
      ) {
        return true;
      }

      return false;
    }
  } else {
    if (index != 0) {
      if (nextMessage?.sender_id == currentMessage?.sender_id) {
        return true;
      }
      return false;
    }
    return false;
  }
};

const isNext = (index: number) => {
  const nextMessage = messages.value[index + 1];
  const secondNextMessage = messages.value[index + 2];

  if (Array.isArray(messages.value)) {
    if (index != messages.value?.length - 2) {
      if (
        messages.value[index + 1]?.sender_id ==
        messages.value[index + 2].sender_id
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    if (
      (messages.value as ChatMessages[]) &&
      index < (messages.value as ChatMessages[]).length - 2
    ) {
      if (nextMessage?.sender_id == secondNextMessage?.sender_id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};

// checks wether the new message has been sent in a new day or not.
const renderDivider = (index: number, previousIndex: number): boolean => {
  if (index === 3) {
    return true;
  } else {
    return false;
  }
};

// scroll messages to bottom.
onUpdated(() => {
  if (store.messageContainer && !store.checkselectMessages) {
    store.messageContainer?.scrollTo({
      top: store.messageContainer?.scrollHeight + 10,
    });
  }
});

const groupedMessages = (messages: ChatMessages[]) => {
  const groupedMessages: (ChatMessages | ChatMessages[])[] = [];
  let currentGroup: ChatMessages[] = [];

  for (const message of messages) {
    
    if (message.media_files && (message.media_files.type === "image" || message.media_files.type === "video")) {
      if (currentGroup.length === 0 || currentGroup[0].sender_id === message.sender_id) {
        currentGroup.push(message);
      } else {
        // Check if the current group has more than 3 media files
        if (currentGroup.length > 3) {
          groupedMessages.push([...currentGroup]);
        } else {
          groupedMessages.push(...currentGroup);
        }

        currentGroup = [message];
      }
    } else {
      if (currentGroup.length > 2) {
        groupedMessages.push([...currentGroup]);
      } else {
        groupedMessages.push(...currentGroup);
      }
      currentGroup = [];
      groupedMessages.push(message);
    }
  }

  // Check if there are remaining messages in the current group
  if (currentGroup.length > 3) {
    groupedMessages.push([...currentGroup]);
  } else {
    groupedMessages.push(...currentGroup);
  }

  return groupedMessages;
};

const messageStatusUpdate = async (data: messageStatusUpdateData) => {
  const updateMessageStatus = "/api/v1/conversations/update_message_status";
  const result = await axios.post(`${APIBaseUrl}${updateMessageStatus}`, data);
  return result;
};
onMounted(async () => {
  store.messageContainer = container.value;
  const UserChat = await fetch(`${APIBaseUrl}/api/v1/get-conversation`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      consultation_id: store.activeConversationId,
    }),
  });

  if (UserChat.ok) {
    const UserChatData = await UserChat.json();

    // Loop through the data array in the response
    for (const dataItem of UserChatData?.data) {
      const oldMessage: ChatMessages = {
        id: dataItem.id,
        messageEdited: dataItem.messageEdited,
        content: dataItem.message,
        media_files: dataItem.media_files,
        message_time: dataItem.created_at,
        date: store.messageSentTime(dataItem.created_at.toString()),
        status: dataItem.status,
        sender_id: dataItem.sender_id,
        loading: store.isLoading,
        replyMessageId: dataItem.replyMessageId,
        notification_send: false,
        hasTemporaryId: false,
        loadingPercent: store.fileUploadPercent,
      };
      messages.value.push(oldMessage);
      store.messages = messages.value;
    }

    // Updating The Message status Sent To Read at Other Side.
    try {
      const unReadMessage: number[] = messages.value
        .filter((message) => message.status != "Read")
        .filter((message) => message.sender_id !== store?.loginUserList?.id)
        .map((message) => message.id);
      if (unReadMessage && unReadMessage.length > 0) {
        const requestData = {
          message_id: unReadMessage,
          message_status: "Read",
          consultation_id: store.activeConversationId,
        };
        const result = await messageStatusUpdate(requestData);
        if (result) {
          store.lastMessage.map((messageData: LastMessage) => {
            if (messageData.consultation_id == store.activeConversationId) {
              messageData.unread_message_count = 0;
            }
            return messageData;
          });
        }
      }
    } catch (err) {
      console.log("Catch Error : ", err);
    }
  } else {
    console.error("Error fetching data:", UserChat.statusText);
  }

  const pusherId = import.meta.env.VITE_PUSHER_ID;
  const clusterId = import.meta.env.VITE_PUSHER_CLUSTERID;

  const pusher = new Pusher(pusherId, {
    cluster: clusterId,
  });

  const channel = pusher.subscribe(
    "conversation." + store.activeConversationId,
  );

  // User is online and in active chat
  channel.bind("message", (data: DbMessage) => {
    messages.value = store.messages;
    const isAvaiableUser = store.userStatus.find(
      (arrayData: UserStatus) => arrayData.user_id == data.receiver_id,
    );

    const requestData = {
      message_id: data.id,
      message_status: "Sent",
      consultation_id: data.consultation_id,
    };
    if (isAvaiableUser) {
      if (
        isAvaiableUser.ChatId == data.consultation_id.toString() &&
        isAvaiableUser.status == "online"
      ) {
        requestData.message_status = "Read";
      } else if (isAvaiableUser.status == "online") {
        requestData.message_status = "Receive";
      }
    }

    const newMessage: ChatMessages = {
      id: data.id,
      messageEdited: "",
      content: data.message,
      media_files: data.media_files,
      message_time: data.created_at,
      date: store.messageSentTime(data.created_at.toString()),
      status: data.status,
      sender_id: data.sender_id,
      loading: store.isLoading,
      replyMessageId: data.replyMessageId,
      hasTemporaryId: false,
    };

    if (store.MessageTempDetails.length >= 0) {
      store.MessageTempDetails.map((tempMessage: MessageTempDetails) => {
        store.messages.map((message: ChatMessages) => {
          if (tempMessage.id == message.id) {
            message.id = data.id;
            (message.messageEdited = ""),
              (message.content = data.message),
              (message.media_files = data.media_files),
              (message.message_time = data.created_at),
              (message.date = store.messageSentTime(
                data.created_at.toString(),
              )),
              (message.status = "Sent"),
              (message.sender_id = data.sender_id),
              (message.loading = false),
              (message.hasTemporaryId = false),
              (message.replyMessageId = data.replyMessageId);
            message.loadingPercent = data.loadingPercent;
          }
          return message;
        });
      });
      store.MessageTempDetails = [];
      messages.value = store.messages;
    }

    const alreadyMessage = store.messages.find((message: ChatMessages) => {
      if (message.id == data.id) {
        return message;
      }
    });

    if (!alreadyMessage) {
      if (
        isAvaiableUser &&
        isAvaiableUser.ChatId == data.consultation_id.toString() &&
        isAvaiableUser.status == "online"
      ) {
        // Push the newMessage into the messages array
        messages.value.push(newMessage);
        store.messages = messages.value;
      }
    }

    // Updating Messages at sidebar pannel....
    const latestMsg = store.lastMessage?.find(
      (latestMsg: LastMessage) =>
        latestMsg.consultation_id === data.consultation_id,
    );
    if (latestMsg) {
      if (data.media_files) {
        if (data.media_files?.type === "image") {
          latestMsg.message = "Media file";
        }

        if (data.media_files?.type === "audio") {
          latestMsg.message = "Recording";
        }
      } else {
        latestMsg.message = data.message;
      }
      latestMsg.date = store.messageSentTime(data.created_at.toString());
    }

    messageStatusUpdate(requestData);
  });

  // When Message Is Edited Event Called....
  channel.bind("messageUpdateEvent", (data: any) => {
    const EditMsg = store.messages?.find(
      (EditMsg: ChatMessages) => EditMsg.id === data.message_id,
    );
    if (EditMsg) {
      EditMsg.messageEdited = data.new_message;
    }
  });

  // When Message Is Deleted Event Called....
  channel.bind("messageDeleteEvent", (data: any) => {
    for (let i = 0; i < data.message_id.length; i++) {
      const index = store.messages?.findIndex(
        (e: ChatMessages) => e.id === data.message_id[i],
      );
      if (index !== -1) {
        store.messages[index].content = "The message has been removed";
        // Set media_files to empty values
        store.messages[index].media_files = {
          type: "",
          path: "",
          thumb_path: "",
          name: "",
          size: "",
          id: 0,
          duration: "",
          isMediaDelete: true,
        };
      }
    }

    const latestMsg = store.lastMessage?.find(
      (latestMsg: LastMessage) =>
        latestMsg.consultation_id === data.consultation_id,
    );
    if (latestMsg) {
      latestMsg.message = "The message has been removed";
      const dateTime = new Date();
      latestMsg.date =
        dateTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) ?? "";
    }
  });

  // Updating The Message Status...
  channel.bind("messageStatusUpdateEvent", (data: any) => {
    for (let i = 0; i < data.id.length; i++) {
      const messageData = store.messages.find(
        (message: ChatMessages) => data.id[i] == message.id,
      );
      if (messageData) {
        messageData.status = data.status;
      }
    }
  });

  // When Chat Is Ended Then seding User To Archive Chat....
  channel.bind("sentUserToArchiveChatEvent", (data: any) => {
    store.activeSidebarComponent = "archived";
  });
});

function isSelected(message: ChatMessages | ChatMessages[]) {
  const messageIds = Array.isArray(message) ? getId(message) : [message.id];
  return props.selectedMessages.some((selectedGroup) => {
    const selectedIds = Array.isArray(selectedGroup)
      ? selectedGroup
      : [selectedGroup];
    return JSON.stringify(selectedIds) === JSON.stringify(messageIds);
  });
}

function getId(message: ChatMessages | ChatMessages[]) {
  if (Array.isArray(message)) {
    return message.map((e) => e.id);
  } else {
    return [message.id];
  }
}

async function handleUnMute() {
  await updateAllData(unMuteChatUrl, muteChatData);
  if (updateEntityDataStatus.value && updateEntityDataStatus.value === 200) {
    store.lastMessage.map((e: LastMessage) => {
      if (e.consultation_id == store.activeConversationId) {
        e.isMuted = 0;
        store.isMute = false;
      }
    });
  }
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="store.isMute === true"
      :class="
        !store.openAttachmentBar
          ? 'xs:mt-[70px] md:mt-0 xs:z-10 xs:absolute md:static grow xs:w-full md:w-fit scrollbar-hidden transition-all duration-500 xs:left-[0px] xs:static lg:w-auto h-[0px]'
          : 'hidden'
      "
    >
      <div class="flex flex-col scrollbar-hidden">
        <div class="w-full">
          <div
            class="w-full min-h-[70px] px-5 py-3 bg-[#F8F9FA] flex justify-between items-center"
            style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1)"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.53C15.58 18.04 14.83 18.46 14 18.7V20.77C15.38 20.45 16.63 19.82 17.68 18.96L19.73 21L21 19.73L12 10.73M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.62 14.91 21 13.5 21 12C21 7.72 18 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V10.18L16.45 12.63C16.5 12.43 16.5 12.21 16.5 12Z"
                  fill="#7B809A"
                />
              </svg>
              <p class="text-[#7B809A] text-[14px] ml-4 mt-1">
                This chat is muted.
              </p>
            </div>
            <div>
              <p
                class="text-[#7B809A] text-[14px] ml-4 mt-1 underline cursor-pointer font-bold"
                @click="handleUnMute"
              >
                Unmute
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <div
    ref="container"
    :class="
      store.openAttachmentBar
        ? 'grow flex flex-col scrollbar-hidden lg:h-[70vh] items-end'
        : 'grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden h-[720px] overflow-x-hidden'
    "
    style="
      background: #fffcf9 url(/svg/chatMiddleIMG.svg);
      background-size: cover;
      background-repeat: no-repeat;
    "
  >
    <div v-if="messages.length === 1">
      <Message :isFirst="true" />
    </div>

    <div v-else>
     
    <div v-if="store.messages?.length <= 0"
    class="flex justify-center items-center mt-[28vh]"
    >
    <Loading3 />
    </div>

    <div>
    <div
      v-if="store.status !== 'loading' && store.searchMessage?.length === 0"
      v-for="(message, index) in groupedMessages(messages).slice(1)"
      :key="index"
    >
      <Message
      :message="message"
      :isFirst="false"
      :self="
        Array.isArray(message)
          ? isSelf(message[0]?.sender_id)
          : isSelf(message?.sender_id)
      "
      :divider="renderDivider(index, index - 1)"
      :selected="isSelected(message)"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
      :previous="isPrevious(index)"
      :next="isNext(index)"
      :loading="store.isLoading"
      />
    </div>

    <div
      v-else-if="store.status !== 'loading' && store.searchMessage"
      v-for="(message, index) in groupedMessages(store.searchMessage)"
      :key="'searchMessage-' + index"
    >
      <Message
      :message="message"
      :isFirst="false"
      :self="
      Array.isArray(message)
      ? isSelf(message[0]?.sender_id)
      : isSelf(message?.sender_id)
      "
      :divider="renderDivider(index, index - 1)"
      :selected="isSelected(message)"
      :handle-select-message="handleSelectMessage"
      :handle-deselect-message="handleDeselectMessage"
      :previous="isPrevious(index)"
      :next="isNext(index)"
      :loading="store.isLoading"
      />
    </div>
    </div>
    </div>

      <div
      class="shadow-xl w-[100%] md:w-[50%] absolute lg:w-[40%] min-[1900px]:h-[76vh]"
      :class="store.openAttachmentBar === false ? 'hidden' : ''"
      style="
      background: url(/svg/chatMiddleIMG.svg);
      background-size: cover;
      background-repeat: no-repeat;
      background-color: white;
      "
      >
      <AttachmentBar
      v-if="store.openAttachmentBar"
      Media="Media"
      Links="Links"
      Documents="Documents"
      />

      <div v-if="store.media === true">
      <Media />
      </div>
      <div v-if="store.attachmentlinks === true">
      <Links />
      </div>
      <div v-if="store.attachmentdocuments === true">
      <Documents />
      </div>
      </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-100%);
}
</style>
