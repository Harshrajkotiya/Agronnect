export interface CallList {
  keyword: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  token: string;
  lastSeen: Date;
  contacts: IContact[];
}

export interface IContact {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  lastSeen: Date;
}

export interface IPreviewData {
  title: string;
  image?: string;
  description: string;
  domain: string;
  link: string;
}

export interface IAttachment {
  id: number;
  type: string;
  name: string;
  size: string;
  file?: File | null;
}

export interface IRecording {
  id: number;
  size: string;
  src: string;
  duration: string;
  file?: File;
}

export interface IMessage {
  id: number;
  type?: string;
  content?: string | IRecording;
  date: string;
  sender: IContact;
  replyTo?: number;
  previewData?: IPreviewData;
  attachments?: IAttachment[];
  state: string;
}

export interface IContactGroup {
  letter: string;
  contacts: IContact[];
}

export interface INotification {
  flag: string;
  title: string;
  message: string;
}

export interface ISettings {
  lastSeen: boolean;
  readReceipt: boolean;
  joiningGroups: boolean;
  privateMessages: boolean;
  darkMode: boolean;
  borderedTheme: boolean;
  allowNotifications: boolean;
  keepNotifications: boolean;
}

export interface ICall {
  type: string;
  direction: string;
  status: string;
  date: string;
  length: string;
  members: IContact[];
  adminIds: number[];
}

export interface IEmoji {
  n: string[];
  u: string;
  r?: string;
  v?: string[];
}

export interface IUserData {
  id?: number;
  name?: string;
  last_name?: string;
  country?: string | undefined;
  cv_name?: string;
  cv?: string;
  specs?: string[];
  crops?: string[];
  languages?: string | null | "";
  specialties: string[];
  work_experience?: string;
  about?: string;
  value?: string;
  user_role?: "specialist" | "farmer";
  profile_image?: string;
  status: number;
}

export interface IEntityDetails {
  user: {
    user_types: string;
  };
  id: number;
  name: string;
  user_types: string;
}

export interface Store {
  loginUserList: {
    user: {
      user_types: "specialist" | "farmer";
    };
  } | null;
  // Other properties in your Store interface...
}

export interface CheckTokenDetails {
  id: number;
  name: string;
  lastname: string;
  last_name: string;
  user_types: string;
  country: string;
  email: string;
  phone: string | null;
  crops_expertise: string[] | null;
  specialties: string[] | null;
  work_experience: string[] | null;
  resume: string | null;
  profile_image: string | null;
  specialist_languages: string[] | null;
  token_expiration: number;
}

export interface DbMessage {
  id: number;
  message: string;
  media_files?: MediaFile;
  status: string;
  sender_id: number;
  receiver_id: number;
  created_at: Date;
  messageEdited?: string | undefined | null;
  consultation_id: number;
  replyMessageId: number;
  loadingPercent: number;
}

export interface MediaFile {
  type?: string | undefined;
  path: string | undefined;
  thumb_path?: string | undefined ;
  name: string | undefined;
  size: string | undefined;
  id?: number | undefined ;
  created_at?: Date | undefined;
  duration?: string | undefined ;
  isMediaDelete?: boolean;
  loadingPercent?: string;
}

export interface ChatMessages {
  id: number;
  content: string;
  media_files?: MediaFile;
  date: string | undefined | null;
  status: string;
  sender_id: number;
  type?: string;
  receiver_id?: number;
  created_at?: Date | string;
  message?: string;
  emoji?: string;
  messageEdited?: string | undefined | null;
  message_time?: Date | string | undefined | null;
  loading?: Boolean;
  isMatched?: boolean;
  replyMessageId?: number;
  notification_send?: boolean;
  hasTemporaryId: boolean;
  loadingPercent?: number | null ;

}

export interface IConversation {
  id: number;
  country?: string | null;
  name?: string | null;
  user_types?: string | null;
  last_name?: string | null;
  user_role?: string | null;
  languages?: string[] | null;
  email?: string | null;
  profile_image?: string | null;

  type: string;
  avatar?: string | null;
  admins?: number[];
  // contacts: IContact[];
  messages: IMessage[];

  // message: IMessage[];
  pinnedMessage?: IMessage;
  pinnedMessageHidden?: boolean;
  replyMessage?: IMessage;
  // unread?: number;
  draftMessage: string;
  consultation_id?: number | null | undefined;

  sender?: number | null | undefined;
  receiver_id?: number | null | undefined;
  message?: string | null | undefined;
  date?: string | null | undefined;
  status?: string | null | undefined;
  lastname?: string | null | undefined;
}

export interface LastMessage {
  id: number;
  sender: number;
  receiver_id: number;
  message: string;
  messages?: IMessage[];
  consultation_id: number;
  date: string | null | undefined;
  status?: string | null;
  name?: string | null;
  lastname?: string | null;
  last_name?: string | null;
  profile_image?: string | null;
  message_time?: Date | null;
  unread_message_count?: number;
  isMuted?: number | string;
  mutedDuration?: number,
  mutedTime?: string | number,
  user_id ?: number
}

export interface IEndChatData {
  status: number | null | undefined;
}

export interface IArchiveData {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string | null;
  media_files: null | any[];
  consultation_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  consultation_status: string;
}

export interface LinkData {
  content: string;
  titleElement: string;
  faviconElement: string; 
}

export interface UserStatus {
  user_id: number;
  status: string;
  ChatId: string | null | undefined;
  updatedTime: string | null | undefined;
  isInSameConversationChannel?: boolean;
}

export interface ActiveChatData {
  user_id: number;
  chatId: string;
  isInSameConversationChannel: boolean;
}

export interface messageStatusUpdateData {
  message_id: number[] | number;
  message_status: string;
  consultation_id: number | null | undefined;
}

export interface MessageTempDetails {
  id: number;
}

export interface RadioItem {
  label: string;
}





            