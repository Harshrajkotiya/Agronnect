<script setup lang="ts">
import ChatEnded from "@src/components/shared/modals/ChatSettingModal/ChatEnded.vue";
import MuteNotification from "@src/components/shared/modals/ChatSettingModal/MuteNotification.vue";
import ReportSpecialist from "@src/components/shared/modals/ChatSettingModal/ReportSpecialist.vue";
import Typography from "@src/components/ui/data-display/Typography.vue";
import IconButton from "@src/components/ui/inputs/IconButton.vue";
import Dropdown from "@src/components/ui/navigation/Dropdown/Dropdown.vue";
import DropdownLink from "@src/components/ui/navigation/Dropdown/DropdownLink.vue";
import useStore from "@src/store/store";
import type { IConversation, UserStatus,ChatMessages } from "@src/types";
import { twMerge } from "tailwind-merge";
import { Ref, computed, ref, watch,onMounted } from "vue";
import Pusher from "pusher-js";

const props = defineProps<{
  selectedMessages: number[];
  handleOpenInfo: () => void;
  handleOpenSearch: () => void;
  handleSelectMessage: (messageId: number | null) => void;
  variant?: string;
  class?: string;
}>();
const chatSearchKeyword: Ref<string> = ref("");
const baseClasses = `w-full h-8 py-3 px-7 border outline-none rounded-full text-black
placeholder:text-black placeholder:opacity-40 focus:outline-none 
focus:ring focus:ring-indigo-100 duration-200 transition ease-out
text-opacity-70`;

const variantClasses = computed(() => {
  if (props.variant === "outline") {
    return "bg-transparent border-gray-100 focus:outline-none";
  } else {
    return "border-none bg-[#F8F9FA] focus:ring-0 bg-white";
  }
});

const classes = twMerge(baseClasses, variantClasses.value, props.class);
const store = useStore();
const showDropdown = ref(false);
const topSearchbar = ref(false);
const pusherId = import.meta.env.VITE_PUSHER_ID;
const clusterId = import.meta.env.VITE_PUSHER_CLUSTERID;
const pusher = new Pusher(pusherId, {
  cluster: clusterId,
});

// (event) close dropdown menu when click item
const handleCloseDropdown = () => {
  showDropdown.value = false;
};

// (event) close dropdown menu when clicking outside the menu.
const handleClickOutside = (event: Event) => {
  let target = event.target as HTMLElement;
  let parentElement = target.parentElement as HTMLElement;

  if (
    target &&
    !(target.classList as Element["classList"]).contains("open-top-menu") &&
    parentElement &&
    !(parentElement.classList as Element["classList"]).contains("open-top-menu")
  ) {
    handleCloseDropdown();
  }
};

// (event) close the selected conversation
const handleCloseConversation = () => {
  store.conversationOpen = "close";
  store.activeConversationId = null;
  store.activeReceiverId = null;
};

// (event) open the voice call modal and expand call

const openMuteNotificationModal = ref(false);
const openReportSpecialistModal = ref(false);
const openChatEndedModal = ref(false);
const showContextMenu = ref(false);
const contextMenuCoordinations: Ref<{ x: number; y: number } | undefined> = ref();

const userName = ref<string>();
const profile_image = ref<string>();
const userStatus = ref<string>('offline');

if (store.userType === 'specialist') {
  store.farmer?.map((e: IConversation) => {
    if (e.id === store.activeUserId) {
      userName.value = e.name + " " + e.last_name;

      if (e.profile_image === null || '') {
        profile_image.value = ""
      }
      else {
        profile_image.value = e.profile_image
      }
    }
  })
} else if (store.userType === 'farmer') {
  store.specialist?.map((e) => {
    if (e.id === store.activeSpecialistId) {
      userName.value = e.name + " " + e.last_name

      if (e.profile_image === null || '') {
        profile_image.value = ""
      }
      else {
        profile_image.value = e.profile_image
      }
    }
  })
}

const handleAttachments = () => {
  store.openAttachmentBar = true;
  showContextMenu.value = false;
  store.media = true;
};

const handleBack = () => {
  store.openAttachmentBar = false;
  store.media = false;
  store.attachmentlinks = false;
  store.attachmentdocuments = false;
};

const handleShowContextMenu = (event: any) => {

  showContextMenu.value = true;

  contextMenuCoordinations.value = {

    x: window.innerWidth - 205 <= event.pageX
      ? window.innerWidth - 220
      : event.pageX,

    y: window.innerHeight - 125 <= event.pageY
      ? window.innerHeight - 200
      : event.pageY,
  };
};

// (event) closes the context menu
const handleCloseContextMenu = () => {
  showContextMenu.value = false;
};

const contextConfig = {
  handler: handleCloseContextMenu,
  events: ["contextmenu"],
};
watch([chatSearchKeyword], () => {
  store.inputSearch = chatSearchKeyword.value;
});

function handleCloseSearch() {
  chatSearchKeyword.value = '';
  store.searchMessage = [];
  store.inputSearch = '';
  topSearchbar.value = false
}

const shouldShowMuteNotificationLink = computed(() => {
  const isShowMute = store.lastMessage.some(e => e.consultation_id === store.activeConversationId && e.isMuted === 1);
  return !isShowMute;
});

function handleOpenMuteNoti() {
  const isShowMute = store.lastMessage.some(e => e.consultation_id === store.activeConversationId && e.isMuted === 1);
  if (!isShowMute) {
    openMuteNotificationModal.value = true
  }
}

onMounted(() => {
  const isAvaiableUser = store.userStatus?.find((arrayData: UserStatus) => arrayData.user_id === (store.userType === 'farmer' ? store.activeSpecialistId : store.activeUserId));

  if(isAvaiableUser){
    userStatus.value = isAvaiableUser.status;
    updateUserStatus(isAvaiableUser);
  }
});

const updateUserStatus = (isAvaiableUser: UserStatus) => {

  const channel = pusher.subscribe('user-status-channel');

  // Listen for online/offline events
  channel.bind('user-online', (userResponse: any) => {
    if (isAvaiableUser && userResponse['user_id'] == isAvaiableUser?.user_id) {
      userStatus.value = "online";
      isAvaiableUser.status = "online";
    }

    store.messages.map((messageData: ChatMessages) => {
      if (messageData.receiver_id == userResponse['user_id']) {
        messageData.status = "Receive";
      }
      return messageData;
    });
  });

  channel.bind('user-offline', (userResponse: any) => {
    if (isAvaiableUser && userResponse['user_id'] == isAvaiableUser?.user_id) {
      userStatus.value = "offline";
      isAvaiableUser.status = "offline";
    }
  });
}
</script>

<template>
  <!--conversation info-->
  <div class="w-full flex justify-center items-center">
    <div class="group mr-4 md:hidden min-[919px]:flex min-[768px]:flex">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        class="cursor-pointer" @click="
          store.openAttachmentBar ? handleBack() : handleCloseConversation()
          ">
        <path d="M20 11V13H8L13.5 18.5L12.08 19.92L4.16 12L12.08 4.08002L13.5 5.50002L8 11H20Z" fill="#6B7C85" />
      </svg>
    </div>

    <!-- @click="props.handleOpenInfo" -->
    <div v-if="store.status !== 'loading'" class="flex grow">
      <div class="relative w-full" v-if="topSearchbar === true">
        <i class="absolute left-0 top-[12.5px] ml-3 text-center">
          <img class="w-5 h-5" src="/svg/SearchIcon.svg" alt="SearchIcon">
        </i>
        <div class="flex gap-5">
          <input ref="input" type="text" placeholder="Search here" :class="classes" v-model="chatSearchKeyword" />

          <div class="flex items-center cursor-pointer" @click="handleCloseSearch()">
            <img src="/svg/CrossIcon.svg" alt="CrossIcon">
          </div>
        </div>
      </div>

      <button v-if="topSearchbar === false" class="mr-5 outline-none" @click="store.handleViewProfile"
        aria-label="profile avatar">
        <div v-if="profile_image === ''" :style="{
          backgroundImage: `url(https://cdn-icons-png.flaticon.com/512/666/666201.png)`,
        }" class="w-[36px] h-[36px] rounded-full bg-cover bg-center"></div>

        <div v-else :style="{
          backgroundImage: `url(${profile_image})`,
        }" class="w-[36px] h-[36px] rounded-full bg-cover bg-center"></div>
      </button>

      <!--name and last seen-->
      <div class="flex flex-col" v-if="topSearchbar === false">
        <Typography variant="heading-2" @click="store.handleViewProfile" class="mb-2 default-outline cursor-pointer"
          tabindex="0">
          {{ userName }}
        </Typography>

        
        <Typography variant="body-2"
          class="font-extralight default-outline rounded-[4px] uppercase flex text-[#6B7C85] mt-1 px-1" tabindex="0">
          <img :src="userStatus === 'online' ? '/svg/UserProfileOnline.svg' : '/svg/UserProfileOffline.svg'" />
          <p>{{userStatus}}</p>
        </Typography>
      </div>
    </div>



    <div class="flex" :class="{ hidden: store.status === 'loading' }">

      <div class="flex cursor-pointer" @click="topSearchbar = true" v-if="topSearchbar === false">
        <img src="/svg/SearchIcon.svg" alt="SearchIcon" />
      </div>

      <div class="bg-[#E9ECEF] w-[2%] mr-5 ml-5 hidden min-[767px]:flex" v-if="topSearchbar === false">
        <hr />
      </div>

      <div :class="store.openAttachmentBar ? 'hidden' : 'relative'" v-if="topSearchbar === false">
        <!--dropdown menu button-->
        <IconButton id="open-conversation-menu" @click="showDropdown = !showDropdown" tabindex="0"
          class="open-top-menu group w-7 h-7" :aria-expanded="showDropdown" aria-controls="conversation-menu"
          title="toggle conversation menu" aria-label="toggle conversation menu">
          <img src="/svg/ContextMenuIcon.svg" alt="Network error" class="mx-3" />
        </IconButton>

        <!--dropdown menu-->

        <Dropdown id="conversation-menu" :close-dropdown="() => (showDropdown = false)" :show="showDropdown"
          :position="['right-0']" :handle-click-outside="handleClickOutside" aria-labelledby="open-conversation-menu">

          <DropdownLink class="hover:bg-[#F8F9FA] focus:outline-none " @click="store.handleViewProfile">
            <div class="h-5 w-5 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 19H5V5H19M19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 3.89 20.1 3 19 3ZM16.5 16.25C16.5 14.75 13.5 14 12 14C10.5 14 7.5 14.75 7.5 16.25V17H16.5M12 12.25C12.5967 12.25 13.169 12.0129 13.591 11.591C14.0129 11.169 14.25 10.5967 14.25 10C14.25 9.40326 14.0129 8.83097 13.591 8.40901C13.169 7.98705 12.5967 7.75 12 7.75C11.4033 7.75 10.831 7.98705 10.409 8.40901C9.98705 8.83097 9.75 9.40326 9.75 10C9.75 10.5967 9.98705 11.169 10.409 11.591C10.831 12.0129 11.4033 12.25 12 12.25Z"
                  fill="#7B809A" />
              </svg>
            </div>
            <p class="ml-2">View profile</p>
          </DropdownLink>

          <DropdownLink class="hover:bg-[#F8F9FA] focus:outline-none " :handle-click="handleCloseDropdown" @click="() => handleAttachments()"
            @contextmenu.prevent="handleShowContextMenu" v-click-outside="contextConfig">
            <div class="h-5 w-5 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16.5 6V17.5C16.5 18.5609 16.0786 19.5783 15.3284 20.3284C14.5783 21.0786 13.5609 21.5 12.5 21.5C11.4391 21.5 10.4217 21.0786 9.67157 20.3284C8.92143 19.5783 8.5 18.5609 8.5 17.5V5C8.5 4.33696 8.76339 3.70107 9.23223 3.23223C9.70107 2.76339 10.337 2.5 11 2.5C11.663 2.5 12.2989 2.76339 12.7678 3.23223C13.2366 3.70107 13.5 4.33696 13.5 5V15.5C13.5 15.7652 13.3946 16.0196 13.2071 16.2071C13.0196 16.3946 12.7652 16.5 12.5 16.5C12.2348 16.5 11.9804 16.3946 11.7929 16.2071C11.6054 16.0196 11.5 15.7652 11.5 15.5V6H10V15.5C10 16.163 10.2634 16.7989 10.7322 17.2678C11.2011 17.7366 11.837 18 12.5 18C13.163 18 13.7989 17.7366 14.2678 17.2678C14.7366 16.7989 15 16.163 15 15.5V5C15 3.93913 14.5786 2.92172 13.8284 2.17157C13.0783 1.42143 12.0609 1 11 1C9.93913 1 8.92172 1.42143 8.17157 2.17157C7.42143 2.92172 7 3.93913 7 5V17.5C7 18.9587 7.57946 20.3576 8.61091 21.3891C9.64236 22.4205 11.0413 23 12.5 23C13.9587 23 15.3576 22.4205 16.3891 21.3891C17.4205 20.3576 18 18.9587 18 17.5V6H16.5Z"
                  fill="#7B809A" />
              </svg>
            </div>

            Attachments
          </DropdownLink>

          <DropdownLink class="hover:bg-[#F8F9FA] focus:outline-none " @click="
            props.handleSelectMessage(null),
            (store.checkselectMessages = true)
            ">
            <div class="h-5 w-5 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 2H8C7.46957 2 6.96086 2.21071 6.58579 2.58579C6.21071 2.96086 6 3.46957 6 4V16C6 16.5304 6.21071 17.0391 6.58579 17.4142C6.96086 17.7893 7.46957 18 8 18H20C20.5304 18 21.0391 17.7893 21.4142 17.4142C21.7893 17.0391 22 16.5304 22 16V4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2ZM20 16H8V4H20V16ZM16 20V22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V7H4V20H16ZM18.53 8.06L17.47 7L12.59 11.88L10.47 9.76L9.41 10.82L12.59 14L18.53 8.06Z"
                  fill="#7B809A" />
              </svg>
            </div>

            Select messages
          </DropdownLink>

          <DropdownLink
            :class="{ 'hover:bg-[#F8F9FA] focus:outline-none ': shouldShowMuteNotificationLink, 'opacity-75 cursor-default focus:outline-none': !shouldShowMuteNotificationLink }"
            :handle-click="handleCloseDropdown" @click="handleOpenMuteNoti">

            <div class="h-5 w-5 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.53C15.58 18.04 14.83 18.46 14 18.7V20.77C15.38 20.45 16.63 19.82 17.68 18.96L19.73 21L21 19.73L12 10.73M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.62 14.91 21 13.5 21 12C21 7.72 18 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V10.18L16.45 12.63C16.5 12.43 16.5 12.21 16.5 12Z"
                  fill="#7B809A" />
              </svg>
            </div>
            Mute notifications
          </DropdownLink>

          <DropdownLink class="hover:bg-[#F8F9FA] focus:outline-none " :handle-click="handleCloseDropdown"
            @click="openReportSpecialistModal = true">
            <div class="h-5 w-5 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.27 3L3 8.27V15.73L8.27 21H15.73C17.5 19.24 21 15.73 21 15.73V8.27L15.73 3M9.1 5H14.9L19 9.1V14.9L14.9 19H9.1L5 14.9V9.1M11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                  fill="#7B809A" />
              </svg>
            </div>

            Report
          </DropdownLink>

          <DropdownLink class="hover:bg-[#F8F9FA] focus:outline-none " v-if="store.activeSidebarComponent != 'archived' &&
            store.userType === 'specialist'
            " :handle-click="handleCloseDropdown" color="success" @click="openChatEndedModal = true">
            <div class="h-5 w-5 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.7102 8.71005C22.9602 7.46005 22.3902 6.00005 21.7102 5.29005L18.7102 2.29005C17.4502 1.04005 16.0002 1.61005 15.2902 2.29005L13.5902 4.00005H11.0002C9.10017 4.00005 8.00017 5.00005 7.44017 6.15005L3.00017 10.5901V14.5901L2.29017 15.2901C1.04017 16.5501 1.61017 18.0001 2.29017 18.7101L5.29017 21.7101C5.83017 22.2501 6.41017 22.4501 6.96017 22.4501C7.67017 22.4501 8.32017 22.1 8.71017 21.7101L11.4102 19.0001H15.0002C16.7002 19.0001 17.5602 17.9401 17.8702 16.9001C19.0002 16.6001 19.6202 15.7401 19.8702 14.9001C21.4202 14.5001 22.0002 13.0301 22.0002 12.0001V9.00005H21.4102L21.7102 8.71005ZM20.0002 12.0001C20.0002 12.4501 19.8102 13.0001 19.0002 13.0001H18.0002V14.0001C18.0002 14.4501 17.8102 15.0001 17.0002 15.0001H16.0002V16.0001C16.0002 16.4501 15.8102 17.0001 15.0002 17.0001H10.5902L7.31017 20.2801C7.00017 20.5701 6.82017 20.4001 6.71017 20.2901L3.72017 17.3101C3.43017 17.0001 3.60017 16.8201 3.71017 16.7101L5.00017 15.4101V11.4101L7.00017 9.41005V11.0001C7.00017 12.2101 7.80017 14.0001 10.0002 14.0001C12.2002 14.0001 13.0002 12.2101 13.0002 11.0001H20.0002V12.0001ZM20.2902 7.29005L18.5902 9.00005H11.0002V11.0001C11.0002 11.4501 10.8102 12.0001 10.0002 12.0001C9.19017 12.0001 9.00017 11.4501 9.00017 11.0001V8.00005C9.00017 7.54005 9.17017 6.00005 11.0002 6.00005H14.4102L16.6902 3.72005C17.0002 3.43005 17.1802 3.60005 17.2902 3.71005L20.2802 6.69005C20.5702 7.00005 20.4002 7.18005 20.2902 7.29005Z"
                  fill="#00AB89" />
              </svg>
            </div>
            End chat
          </DropdownLink>
        </Dropdown>
      </div>
    </div>
  </div>

  <MuteNotification :open="openMuteNotificationModal" :close-modal="() => (openMuteNotificationModal = false)" />
  <ReportSpecialist :open="openReportSpecialistModal" :close-modal="() => (openReportSpecialistModal = false)" />

  <ChatEnded :open="openChatEndedModal" :close-modal="() => (openChatEndedModal = false)" />
</template>
