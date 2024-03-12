<script setup lang="ts">
import Typography from "@src/components/ui/data-display/Typography.vue";
import { putData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
import type { ActiveChatData, DbMessage, LastMessage, UserStatus } from "@src/types";
import {
shorten
} from "@src/utils";
import axios from "axios";
import Pusher from "pusher-js";
import { Ref, onMounted, reactive, ref } from "vue";
const props = defineProps<{
  conversation: LastMessage;
  isActive?: boolean;
  userId: number;
  handleConversationChange?: (conversationId: number, receiver_id: number) => void;
}>();

const store = useStore();
const showContextMenu = ref(false);
const contextMenuCoordinations: Ref<{ x: number; y: number } | undefined> = ref();
let userIdData = store?.loginUserList?.id == props.conversation.sender ? props.conversation.receiver_id : props.conversation.sender;

const APIBaseUrl = import.meta.env.VITE_API_BASE_URL;
const { updateAllData, updateEntityDataStatus } = putData();
const unMuteChatUrl = `${APIBaseUrl}/api/v1/conversations/unmute_notification`;
const muteChatData = reactive({ consultation_id: store.activeConversationId });

const pusherId = import.meta.env.VITE_PUSHER_ID;
const clusterId = import.meta.env.VITE_PUSHER_CLUSTERID;

const pusher = new Pusher(pusherId, {
  cluster: clusterId,
});
const channel: Record<string, any> = {};

// open context menu.
const handleShowContextMenu = (event: any) => {
  showContextMenu.value = true;
  contextMenuCoordinations.value = {
    x:
      window.innerWidth - 205 <= event.pageX
        ? window.innerWidth - 220
        : event.pageX,
    y:
      window.innerHeight - 125 <= event.pageY
        ? window.innerHeight - 200
        : event.pageY,
  };
};

// (event) closes the context menu
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

// (event) close context menu when opening a new one.
const contextConfig = {
  handler: handleCloseContextMenu,
  events: ["contextmenu"],
};

// (event) select this conversation.
const handleSelectConversation = async () => {
  store.conversationOpen = 'open';
  showContextMenu.value = false;
  store.isViewProfile = false;
  updateActiveChat((props.conversation?.consultation_id).toString());

  if (props.handleConversationChange)
    props.handleConversationChange(props.conversation?.consultation_id, props.conversation?.receiver_id);
  if (userIdData) {
    store.activeReceiverId = userIdData;
    store.activeConversationId = props.conversation?.consultation_id;
    store.activeUserId = userIdData;
    store.activeSpecialistId = userIdData === props.conversation?.sender ? props.conversation?.sender : props.conversation?.receiver_id;
  }
  else {
    store.activeReceiverId = props.conversation?.id;
    store.activeConversationId = props.conversation?.consultation_id;
    store.activeUserId = props.conversation?.id;
    store.activeSpecialistId = props.conversation?.id;
    userIdData = props.conversation?.id;
  }
};

const updateActiveChat = async (chatId: string) => {
  const updateMessageStatusUrl = `${APIBaseUrl}/api/v1/conversations/update_active_chat`;

  const userId = store?.loginUserList?.id.toString() || "";
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("chatId", chatId);

  try {
    axios({
      method: "post",
      url: updateMessageStatusUrl,
      data: formData,
    })
      .then(function (response) {
        updatedChatMessage();
      })
      .catch(function (response) {
        console.log("the Error at update active chat => ", response);
      });
  }
  catch (err) {
    console.log("the Run Time Error at update active chat : ", err);
  }
}

onMounted(() => 
{
  const logInUserDetails = store.userStatus.find((userStatusData: UserStatus)=> userStatusData.user_id == store.loginUserList?.id);

  if(logInUserDetails?.ChatId != undefined && logInUserDetails?.ChatId != null)
  {
    // Updating The Current Chat....
    store.conversationOpen = 'open';
    showContextMenu.value = false;
    store.isViewProfile = false;
    
    const conversationFoundAtStoreLastMessage = store.lastMessage.find((user: LastMessage )=> user.consultation_id == parseInt(logInUserDetails.ChatId ? logInUserDetails.ChatId : '0')) 

    if (props.handleConversationChange && store.activeSidebarComponent != 'archived' && conversationFoundAtStoreLastMessage)
    {

      const lastChat = store.lastMessage.find((message: LastMessage) => message.consultation_id == parseInt(logInUserDetails?.ChatId ? logInUserDetails?.ChatId : '0'));

      const ReceiverId = lastChat?.sender == store.loginUserList?.id ? lastChat?.receiver_id : lastChat?.sender;

      props.handleConversationChange(parseInt(logInUserDetails?.ChatId), ReceiverId ? ReceiverId : 0);  
      store.activeReceiverId = ReceiverId;
      store.activeConversationId = parseInt(logInUserDetails?.ChatId);
      store.activeUserId = ReceiverId;
      store.activeSpecialistId = ReceiverId === props.conversation?.sender ? props.conversation?.sender : props.conversation?.receiver_id;
      updateActiveChat((logInUserDetails?.ChatId).toString());
    }

    const statusChannel = pusher.subscribe('user_status');

    statusChannel.bind('userActiveChatUpdateEvent', (data: ActiveChatData) => {
      const isAvaiableUser = store.userStatus.find((arrayData: UserStatus) => arrayData.user_id == data.user_id);

      // If the object with the specified user_id exists, update it; otherwise, push a new object
      if (isAvaiableUser) {
        // Update the existing object
        isAvaiableUser.ChatId = data.chatId;
        isAvaiableUser.isInSameConversationChannel = data.isInSameConversationChannel;
      }
      updatedChatMessage();
    });

    statusChannel.bind('user-offline', (data: any) => {
      const isAvaiableUser = store.userStatus.find((arrayData: UserStatus) => arrayData.user_id == data.user_id);

      if (isAvaiableUser) {
        isAvaiableUser.status = "offline";
      }
    });
    
    statusChannel.bind('user-online', (data: any) => {
      const isAvaiableUser = store.userStatus.find((arrayData: UserStatus) => arrayData.user_id == data.user_id);

      if (isAvaiableUser) {
        isAvaiableUser.status = "online";
      }
    });
  
  }  
});

const updatedChatMessage = () => {
  // subscribing new channels...
  store.userStatus.map((onlineUsers: UserStatus) => {
    if (onlineUsers.status == "online") {

      const channelName: string = `channel_${store.loginUserList?.id}`;
      channel[channelName] = pusher.subscribe('conversation.' + onlineUsers.ChatId);

      // User is online but active in other chat or other things.
      channel[channelName].bind('message', (data: DbMessage) => {
        // Updating Messages at sidebar pannel....

        if (data.receiver_id == store.loginUserList?.id && onlineUsers.ChatId != store.activeConversationId) {

          const latestMsg = store.lastMessage?.find((latestMsg: LastMessage) => latestMsg.consultation_id === data.consultation_id);
          if (latestMsg && data.id != latestMsg.id) {
            latestMsg.id = data.id;
            if (data.media_files) {
              latestMsg.message = "Media file";
            } else {
              latestMsg.message = data.message;
            }
            latestMsg.date = store.messageSentTime(data.created_at.toString());
            if (latestMsg.unread_message_count) {
              latestMsg.unread_message_count += 1;
            }
            else {
              latestMsg.unread_message_count = 1;
            }
            
            // Browser Notification....
            let userDetails: any;
            if (store.userType == 'specialist') {
              userDetails = store.farmer?.find(farmerDetails => farmerDetails.id == data.sender_id);
            }
            else if (store.userType == 'farmer') {
              userDetails = store.specialist?.find(specialist => specialist.id == data.sender_id);
            }

            showBrowserNotification(userDetails?.name ? userDetails?.name : '', data.message);
            getRecieveConversationTop(store.lastMessage, store.activeSender);
          }
        }
      });
    } else {
      console.log("no users found !");
    }
  });
}

const getRecieveConversationTop = (lastMessage: LastMessage[], sender: number | null | undefined) => {
  let latestConsultant = lastMessage.findIndex(message => message.receiver_id == sender);
  if (latestConsultant !== -1) {
    let removedItem = lastMessage.splice(latestConsultant, 1)[0];
    return lastMessage.unshift(removedItem);
  }
}

async function showBrowserNotification(title: string | undefined, message: string) {
  Notification.requestPermission();
  if (!isChatMuted()) {
    if (Notification.permission === 'granted') {
      const notificationTitle = title || 'Default Title';
      const iconPath = '/svg/logo.svg';
      new Notification(notificationTitle, {
        body: message,
        icon: iconPath,
      });
    }
  }
  else {
    await updateAllData(unMuteChatUrl, muteChatData);
    if (updateEntityDataStatus.value && updateEntityDataStatus.value === 200) {

      Notification.requestPermission();
      if (Notification.permission === 'granted') {
        const notificationTitle = title || 'Default Title';
        const iconPath = '/svg/logo.svg';
        new Notification(notificationTitle, {
          body: message,
          icon: iconPath,
        });
        store.lastMessage.map((e: LastMessage) => {
          if (e.consultation_id == store.activeConversationId) {
            e.isMuted = 0;
            store.isMute = false;
          }
        })
      }
    }
  }
}

// Check if the chat is currently muted
function isChatMuted() {
  const isFindActiveMutedUser = store.lastMessage?.find((e: LastMessage) => e.isMuted == 1);
  const isFindAlwaysMutedUser = store.lastMessage?.find((e: LastMessage) => e.isMuted == 'always');
  if (isFindAlwaysMutedUser) {
    return true;
  } else if (isFindActiveMutedUser) {

    const startTimeString = isFindActiveMutedUser?.mutedTime;
    const startTime: Date = new Date(startTimeString as string);
    const mutedDuration: number = (isFindActiveMutedUser?.mutedDuration || 0) * 60 * 60 * 1000;
    const endTimeString: string = new Date(startTime.getTime() + mutedDuration).toISOString();
    const endTime: Date = new Date(endTimeString);
    const muteDuration: number = endTime.getTime() - startTime.getTime();
    const unmuteTime: Date = new Date(startTime.getTime() + muteDuration);
    const mutedUntil: string = unmuteTime.toISOString();
    return mutedUntil && new Date(mutedUntil) > new Date();
  }
  else {
    console.log("chat not muted");
  }
}

</script>

<template>


  <div class="select-none">
    <button :aria-label="'conversation with' + props.conversation.name" tabindex="0" v-click-outside="contextConfig"
      @contextmenu.prevent="handleShowContextMenu" @click="($event) => {
        handleSelectConversation();
      }
        "
      class="w-full px-5 py-6 flex focus:bg-[#F8F9FA] hover:bg-[#F8F9FA] active:bg-[#F8F9FA] focus:outline-none transition duration-500 ease-out"
      
  :class="{
        'bg-[#F8F9FA]': props.isActive,
      }">
      <div class="mr-4" v-if="conversation.profile_image === null || conversation.profile_image === ''">
        <div :style="{ backgroundImage: `url('https://cdn-icons-png.flaticon.com/512/666/666201.png')` }"
          class="w-7 h-7 rounded-full bg-cover bg-center"></div>
      </div>

      <div class="mr-4" v-else>
        <div :style="{ backgroundImage: `url('${conversation.profile_image}')` }"
          class="w-7 h-7 rounded-full bg-cover bg-center">
        </div>
      </div>

      <div class="w-full flex flex-col">
        <div class="w-full">

          <div class="flex items-start">
            <div class="grow mb-4 text-start">

              <p v-if="conversation.last_name"
                :class="conversation.unread_message_count && conversation.unread_message_count > 0 ? 'font-bold outline-none text-[16px] leading-4 tracking-[0.16px]' : 'outline-none text-[16px] leading-4 tracking-[0.16px] font-normal'">
                {{ conversation.name }} {{ conversation.last_name }}
              </p>

              <p v-else
                :class="conversation.unread_message_count && conversation.unread_message_count > 0 ? 'font-bold outline-none text-[16px] leading-4 tracking-[0.16px]' : 'outline-none text-[16px] leading-4 tracking-[0.16px] font-normal'">
                {{ conversation.name }} {{ conversation.last_name }}
              </p>
            </div>



            <div class="flex">
              <p v-if="conversation.isMuted === 1" class="-mt-1 mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.53C15.58 18.04 14.83 18.46 14 18.7V20.77C15.38 20.45 16.63 19.82 17.68 18.96L19.73 21L21 19.73L12 10.73M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.62 14.91 21 13.5 21 12C21 7.72 18 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V10.18L16.45 12.63C16.5 12.43 16.5 12.21 16.5 12Z"
                    fill="#7B809A" />
                </svg>
              </p>
              <p
                :class="conversation.unread_message_count && conversation.unread_message_count > 0 ? ' outline-none text-xs font-bold leading-4 tracking-[0.16px] text-[#00AB89]' : 'outline-none text-xs font-light leading-4 tracking-[0.16px] text-[#7B809A]'">
                {{ conversation.date }}
              </p>
            </div>

          </div>
        </div>
        <div class="flex justify-between">
          <div>
            <Typography v-if="props.conversation.message === 'Media file' &&
              props.conversation.id !== store.activeConversationId
              " variant="body-2" class="flex justify-start items-center text-[#7B809A]" no-color>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 25" fill="none" class="mr-2">
                <path
                  d="M20 4.5H16.83L15 2.5H9L7.17 4.5H4C3.46957 4.5 2.96086 4.71071 2.58579 5.08579C2.21071 5.46086 2 5.96957 2 6.5V18.5C2 19.0304 2.21071 19.5391 2.58579 19.9142C2.96086 20.2893 3.46957 20.5 4 20.5H20C20.5304 20.5 21.0391 20.2893 21.4142 19.9142C21.7893 19.5391 22 19.0304 22 18.5V6.5C22 5.96957 21.7893 5.46086 21.4142 5.08579C21.0391 4.71071 20.5304 4.5 20 4.5ZM20 18.5H4V6.5H8.05L9.88 4.5H14.12L15.95 6.5H20V18.5ZM12 7.5C10.6739 7.5 9.40215 8.02678 8.46447 8.96447C7.52678 9.90215 7 11.1739 7 12.5C7 13.8261 7.52678 15.0979 8.46447 16.0355C9.40215 16.9732 10.6739 17.5 12 17.5C13.3261 17.5 14.5979 16.9732 15.5355 16.0355C16.4732 15.0979 17 13.8261 17 12.5C17 11.1739 16.4732 9.90215 15.5355 8.96447C14.5979 8.02678 13.3261 7.5 12 7.5ZM12 15.5C11.2044 15.5 10.4413 15.1839 9.87868 14.6213C9.31607 14.0587 9 13.2956 9 12.5C9 11.7044 9.31607 10.9413 9.87868 10.3787C10.4413 9.81607 11.2044 9.5 12 9.5C12.7956 9.5 13.5587 9.81607 14.1213 10.3787C14.6839 10.9413 15 11.7044 15 12.5C15 13.2956 14.6839 14.0587 14.1213 14.6213C13.5587 15.1839 12.7956 15.5 12 15.5Z"
                  fill="#7B809A" />
              </svg>
              {{ props.conversation.message }}
            </Typography>

            <Typography v-else-if="props.conversation.message === 'Video' &&
              props.conversation.id !== store.activeConversationId
              " variant="body-2" class="flex justify-start items-center text-[#7B809A]" no-color>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2">
                <path
                  d="M15 8V16H5V8H15ZM16 6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7V17C3 17.2652 3.10536 17.5196 3.29289 17.7071C3.48043 17.8946 3.73478 18 4 18H16C16.2652 18 16.5196 17.8946 16.7071 17.7071C16.8946 17.5196 17 17.2652 17 17V13.5L21 17.5V6.5L17 10.5V7C17 6.73478 16.8946 6.48043 16.7071 6.29289C16.5196 6.10536 16.2652 6 16 6Z"
                  fill="#7B809A" />
              </svg>
              {{ props.conversation.message }}
            </Typography>

            <Typography v-else-if="props.conversation.message === 'Recording' &&
              props.conversation.id !== store.activeConversationId
              " variant="body-2" class="flex justify-start items-center text-[#7B809A]" no-color>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2">
                <path
                  d="M17.3 11C17.3 14 14.76 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.23 19 14.41 19 11M10.8 4.9C10.8 4.24 11.34 3.7 12 3.7C12.66 3.7 13.2 4.24 13.2 4.9L13.19 11.1C13.19 11.76 12.66 12.3 12 12.3C11.34 12.3 10.8 11.76 10.8 11.1M12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11V5C15 4.20435 14.6839 3.44129 14.1213 2.87868C13.5587 2.31607 12.7956 2 12 2C11.2044 2 10.4413 2.31607 9.87868 2.87868C9.31607 3.44129 9 4.20435 9 5V11C9 11.7956 9.31607 12.5587 9.87868 13.1213C10.4413 13.6839 11.2044 14 12 14Z"
                  fill="#7B809A" />
              </svg>
              {{ props.conversation.message }}
            </Typography>

            <Typography v-else-if="props.conversation.message === 'Document' &&
              props.conversation.id !== store.activeConversationId
              " variant="body-2" class="flex justify-start items-center text-[#7B809A]" no-color>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 20" fill="none" class="mr-2">
                <path
                  d="M2 0C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H14C14.5304 20 15.0391 19.7893 15.4142 19.4142C15.7893 19.0391 16 18.5304 16 18V6L10 0H2ZM2 2H9V7H14V18H2V2ZM4 10V12H12V10H4ZM4 14V16H9V14H4Z"
                  fill="#7B809A" />
              </svg>
              {{ props.conversation.message }}
            </Typography>
            <p v-else-if="props.conversation.message &&
              props.conversation.id !== store.activeConversationId"
              :class="conversation.unread_message_count && conversation.unread_message_count > 0 ? 'font-bold text-black flex justify-start items-center text-[14px]' : 'flex justify-start items-center text-[#7B809A] text-[14px]'">
              {{ shorten(props.conversation.message) }}
            </p>
          </div>

          <div>
            <p class='bg-[#00AB89] text-white text-[12px] font-bold rounded-full px-3 py-1 -mt-1'
              v-if="conversation.unread_message_count && conversation.unread_message_count > 0">
              {{ conversation.unread_message_count }}
            </p>
          </div>

        </div>

      </div>
    </button>
    <hr />
  </div>
</template>
