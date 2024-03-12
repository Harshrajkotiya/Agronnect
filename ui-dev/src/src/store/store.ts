import { defineStore } from "pinia";
import type { Ref } from "vue";

import { computed, ref } from "vue";

import defaults from "@src/store/defaults";
import type {
  ChatMessages,
  CheckTokenDetails,
  ICall,
  IContactGroup,
  IConversation,
  IEmoji,
  INotification,
  ISettings,
  IUser,
  LastMessage,
  MessageTempDetails,
  UserStatus,
} from "@src/types";

const useStore = defineStore("chat", () => {
  // local storage
  const storage = JSON.parse(localStorage.getItem("chat") || "{}");

  // app status refs
  const status = ref("idle");

  // app data refs
  // data refs

  // Define an array type for the given data
  type UserArray = IConversation[];

  const user: Ref<IUser | undefined> = ref(defaults.user);
  const farmer: Ref<UserArray | undefined | null> = ref();
  const specialist: Ref<UserArray | undefined | null> = ref();
  const loginUserList: Ref<CheckTokenDetails | undefined | null> = ref();
  const lastMessage: Ref<LastMessage[]> = ref([]);
  const messages: Ref<ChatMessages[]> = ref([]);
  let singleMsg: Ref<ChatMessages | undefined | null> = ref();
  let messageContainer: Ref<HTMLElement | null> = ref(null);
  let isThereUserList: Ref<boolean> = ref(false);
  let links: Ref<boolean> = ref(false);
  let documents: Ref<boolean> = ref(false);


  const EndChatStatusNumber: Ref<number | null> = ref("" || null);
  const userType: Ref<string | undefined> = ref("farmer" || "");
  const conversations: Ref<IConversation[]> = ref(defaults.conversations || []);
  const notifications: Ref<INotification[]> = ref(defaults.notifications || []);
  // const archivedConversations: Ref<IConversation[]> = ref(
  //   defaults.archive || [],
  // );
  const archivedConversations: Ref<LastMessage[]> = ref(defaults.archive || []);
  const MessageTempDetails: Ref<MessageTempDetails[]> = ref([]);

  const calls: Ref<ICall[]> = ref(defaults.calls || []);
  const settings: Ref<ISettings> = ref(
    storage.settings || defaults.defaultSettings,
  );
  const activeCall: Ref<ICall | undefined> = ref(defaults.activeCall);
  const recentEmoji: Ref<IEmoji[]> = ref(storage.recentEmoji || []);
  const emojiSkinTone: Ref<string> = ref(storage.emojiSkinTone || "neutral");
  const userStatus: Ref<UserStatus[]> = ref([]);
  // ui refs
  const activeSidebarComponent: Ref<string> = ref(
    storage.activeSidebarComponent || "messages",
  );
  const delayLoading = ref(true);
  // const activeConversationId: Ref<number | null> = ref(6 || null);
  const activeConversationId: Ref<number | null | undefined> = ref("" || null);

  const activeUserId: Ref<number | null | undefined> = ref("" || null);
  const activeSender: Ref<number | null | undefined> = ref("" || null);
  const activeSpecialistId: Ref<number | null | undefined> = ref("" || null);
  const activeReceiverId: Ref<number | null | undefined> = ref("" || null);
  const conversationOpen: Ref<string | undefined> = ref(
    storage.conversationOpen,
  );
  const callMinimized = ref(false);
  const openVoiceCall = ref(false);
  const checkselectMessages = ref(false);

  const inputValue = ref("");
  const emoji = ref("");
  const showTextbox = ref(false);
  const showEndChat: Ref<number | null | undefined> = ref("" || null);
  const openAttachmentBar = ref(false);
  const media = ref(false);
  const attachmentlinks = ref(false);
  const attachmentdocuments = ref(false);
  const isEdit = ref(false);
  const emojiReaction = ref("");
  const isReply = ref(false);
  const isDelete = ref(false);
  const isLoading = ref(false);
  const selectedMessages: Ref<number[]> = ref([]);
  const attachmentDeleted: Ref<ChatMessages[]> = ref([]);
  const inputSearch = ref("");
  const isFixed = ref(false);
  const isMute = ref(false);
  const listSearchResult: Ref<LastMessage[]> = ref([]);
  const searchMessage: Ref<ChatMessages[]> = ref([]);
  const isChatLoading = ref(false);
  const fileUploadPercent = ref<number | null>();

  const filteredUnreadChats: Ref<LastMessage[]> = ref([]);
  const isUnreadFilterActive: Ref<boolean> = ref(false);

  // contacts grouped alphabetically.
  const contactGroups: Ref<IContactGroup[] | undefined> = computed(() => {
    if (user.value) {
      let sortedContacts = [...user.value.contacts];

      sortedContacts.sort();

      let groups: IContactGroup[] = [];
      let currentLetter: string = "";
      let groupNames: string[] = [];

      // create an array of letter for every different sort level.
      for (let contact of sortedContacts) {
        // if the first letter is different create a new group.
        if (contact.firstName[0].toUpperCase() !== currentLetter) {
          currentLetter = contact.firstName[0].toUpperCase();
          groupNames.push(currentLetter);
        }
      }

      // create an array that groups contact names based on the first letter;
      for (let groupName of groupNames) {
        let group: IContactGroup = { letter: groupName, contacts: [] };
        for (let contact of sortedContacts) {
          if (contact.firstName[0].toUpperCase() === groupName) {
            group.contacts.push(contact);
          }
        }
        groups.push(group);
      }

      return groups;
    }
  });

  const getStatus = computed(() => status);
  const isViewProfile = ref(false);
  function handleViewProfile() {
    isViewProfile.value = true;
  }

  const chatTime = (chatDate: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - chatDate.getTime()) / (60 * 1000),
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days > 1 ? "days" : "day"} ago`;
    }
  };

  const messageSentTime = (timeToFormat: Date | string) => {
    if (timeToFormat) {
      timeToFormat = timeToFormat;
      const dateTime = new Date(timeToFormat);

      // Check if dateTime is a valid date object
      if (!isNaN(dateTime.getTime())) {
        timeToFormat =
          dateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) ?? "";

        return timeToFormat;
      }
      return "";
    }
  };

  const isIOS =
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document);

  return {
    // status refs
    status,
    getStatus,

    // data refs
    user,
    userType,
    conversations,
    contactGroups,
    notifications,
    archivedConversations,
    calls,
    settings,
    activeCall,
    recentEmoji,
    emojiSkinTone,
    media,
    checkselectMessages,

    // ui refs
    activeSidebarComponent,
    delayLoading,
    activeConversationId,
    activeSpecialistId,
    conversationOpen,
    callMinimized,
    openVoiceCall,
    handleViewProfile,
    isViewProfile,

    showTextbox,
  
    farmer,
    loginUserList,
    specialist,
    activeUserId,
    lastMessage,
    chatTime,
    activeReceiverId,
    isThereUserList,
    links,
    documents,
    showEndChat,
    openAttachmentBar,
    EndChatStatusNumber,
    attachmentlinks,
    attachmentdocuments,
    messages,
    emoji,
    inputValue,
    emojiReaction,
    isEdit,
    singleMsg,
    isReply,
    isDelete,
    messageSentTime,
    MessageTempDetails,

    messageContainer,
    isLoading,
    attachmentDeleted,
    selectedMessages,
    searchMessage,
    inputSearch,
    isFixed,
    listSearchResult,
    isIOS,
    isMute,
    userStatus,
    activeSender,
    isChatLoading,
    fileUploadPercent,
    isUnreadFilterActive,
    filteredUnreadChats
  };
});
export default useStore;
