import type {
  ChatMessages,
  ICall,
  IContact,
  IConversation,
  IMessage,
  IRecording,
  LastMessage
} from "@src/types";
import useStore from "@src/store/store";

/**
 * combine first name and last name of a contact.
 * @param contact
 * @returns A string the combines the first and last names.
 */
export const getFullName = (contact: IContact) => {
  return contact.firstName + " " + contact.lastName;
};

/**
 * get the other contact that is not the authenticated user.
 * @param conversation
 * @returns A contact object representing the other user in the conversation.
 */
export const getOddContact = (conversation: IConversation) => {
  const store = useStore();

  let oddContact;

  // for (let contact of conversation.contacts) {
  //   if (store.user && contact.id !== store.user.id) {
  //     oddContact = contact;
  //   }
  // }

  return oddContact;
};

/**
 * get avatar based on conversation type.
 * @param conversation
 * @returns A string representing the url to the avatar image
 */
export const getAvatar = (conversation: IConversation) => {
  if (["group", "broadcast"].includes(conversation.type)) {
    return conversation?.avatar;
  }
  // else {
  //   let oddContact = getOddContact(conversation);
  //   return oddContact?.oddContact.avatar;
  // }
};

/**
 * get name based on conversation type.
 * @param conversation
 * @returns String
 */
export const getName = (conversation: IConversation) => {

};
/**
 * trim a string when it reaches a certain length and adds three dots
 * at the end.
 * @param text
 * @param maxLength
 * @returns A string that is trimmed according the length provided
 */
export const shorten = (
  message: ChatMessages | string,
  maxLength: number = 23,
) => {
  let text: string | IRecording | undefined;

  if (typeof message === "string") {
    text = message;
  }
  // else {
  //   text = message.content;

  // }

  if (text && typeof text === "string") {
    let trimmedString = text;
    if (text.length > maxLength) {
      // trim the string to the maximum length.
      trimmedString = trimmedString.slice(0, maxLength);
      // add three dots to indicate that there is more to the message.
      trimmedString += "...";
    }
    return trimmedString;
  }

  return "";
};

/**
 * test if the message contains attachments
 * @param message
 * @returns A boolean indicating whether the message has attachments
 */
export const hasAttachments = (message: IMessage) => {
  let attachments = message.attachments;
  return attachments && attachments.length > 0;
};

/**
 * get index of the conversation inside the conversations array
 * @param conversationId
 * @returns A number indicating the index of the conversation.
 */
export const getConversationIndex = (
  conversationId: number,
): number | undefined => {
  let conversationIndex;
  const store = useStore();

  store.conversations.forEach((conversation: IConversation, index: number) => {
    if (conversation.id === conversationId) {
      conversationIndex = index;
    }
  });

  return conversationIndex;
};

/**
 * takes a call object and returns all the members
 * of the call except the authenticated user.
 * @param call
 * @returns An array containing the contacts participating in the call
 */
export const getOtherMembers = (call: ICall) => {
  const store = useStore();
  let members = [];

  if (call) {
    for (let member of call.members) {
      if (store.user && member.id !== store.user.id) {
        members.push(member);
      }
    }
  }

  return members;
};

/**
 * takes a call object and returns a name for the call
 * @param call
 * @param full
 * @param maxLength
 * @returns A string representing name of the call.
 */
export const getCallName = (
  call: ICall,
  full?: boolean,
  maxLength: number = 20,
) => {
  let members = getOtherMembers(call);
  let callName: string = "";

  for (let member of members) {
    callName += getFullName(member);

    if (members.length > 1) {
      callName += ", ";
    }
  }

  if (full) {
    return callName;
  } else {
    return shorten(callName, maxLength);
  }
};

export const getMessageById = (
  conversation: IConversation,
  messageId?: number,
) => {
  if (messageId) {
    return conversation.messages.find((message) => message.id === messageId);
  }
};

/**
 * Convert unicode to native emoji
 *
 * @param unicode - emoji unicode
 */
export const unicodeToEmoji = (unicode: string) => {
  return unicode
    .split("-")
    .map((hex) => parseInt(hex, 16))
    .map((hex) => String.fromCodePoint(hex))
    .join("");
};

export const convertFileSize = (fileSize: string | undefined) => {
  if (fileSize) {
    const sizeInBytes = parseFloat(fileSize);
    var formattedFileSize = "0";

    if (!isNaN(sizeInBytes)) {
      if (sizeInBytes < 1024) {
        formattedFileSize = `${sizeInBytes.toFixed(2)} B`;
      } else if (sizeInBytes < 1024 * 1024) {
        formattedFileSize = `${(sizeInBytes / 1024).toFixed(2)} KB`;
      } else if (sizeInBytes < 1024 * 1024 * 1024) {
        formattedFileSize = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MBs`;
      } else if (sizeInBytes < 1024 * 1024 * 1024 * 1024) {
        formattedFileSize = `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(
          2,
        )} GBs`;
      } else {
        formattedFileSize = `${(
          sizeInBytes /
          (1024 * 1024 * 1024 * 1024)
        ).toFixed(2)} TBs`;
      }
    } else {
      formattedFileSize = "";
    }

    return formattedFileSize;
  }
};


export const formatDateTime = (dateTimeString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
  };

  const dateTime = new Date(dateTimeString);
  const formattedDate = dateTime.toLocaleDateString(undefined, options);

  // Adjusting the order of day and month for "dd/mm/yyyy" format
  const [month, day, year] = formattedDate.split('/');
  return `${day}/${month}/${year}`;
};

export const getLatestConversationTop =(lastMessage: LastMessage[], activeConversationId: number | null | undefined) =>{
  // Find the index of the message with the given ID
  let latestConsultant = lastMessage.findIndex(message => message.consultation_id === activeConversationId);
  // If the given ID is found in the array, move it to the first index
  if (latestConsultant !== -1) {
    let removedItem = lastMessage.splice(latestConsultant, 1)[0];
   return lastMessage.unshift(removedItem);
  }
}
