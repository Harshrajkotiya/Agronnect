// composableMethods.ts
import { reactive, ref } from "vue";
import { postData } from "@src/composable/fetchData";
import { IConversation, LastMessage, UserStatus } from "@src/types";
import useStore from "@src/store/store";
import axios from "axios";

const apiUrl = import.meta.env.VITE_URL;
const APIBaseUrl = import.meta.env.VITE_API_BASE_URL;
const { postAllData, postEntityData, error } = postData();
const { specialist, getSpecialist } = useSpecialist();
const { farmers, getFarmers, isUserListReady } = useFarmers();

export function useSpecialist() {
  const isUserListReady = ref(false);
  const specialist = ref<IConversation[] | null>(null);

  async function getSpecialist(specialist_id: number[]) {
    try {
      const specialistListurl = `${apiUrl}/auth/agronnect/specialist_collection`;
      const user_idString = specialist_id.join(",");
      const d = { user_id: user_idString };
      await postAllData(specialistListurl, d);
      if (postEntityData.value) {
        specialist.value = postEntityData.value;
        isUserListReady.value = true;
      }
    } catch (error) {
      console.error("An error occurred while fetching specialists:", error);
    }
  }

  return { isUserListReady, specialist, getSpecialist };
}
export function useFarmers() {
  const isUserListReady = ref(false);
  const farmers = ref<IConversation[] | null>(null);

  async function getFarmers(user_id: number[]) {
    try {
      const farmerListurl = `${apiUrl}/auth/agronnect/farmer_collection`;
      const user_idString = user_id.join(",");
      const d = reactive({ user_id: user_idString });
      await postAllData(farmerListurl, d);
      if (postEntityData.value) {
        farmers.value = postEntityData.value;
        isUserListReady.value = true;
      }
    } catch (error) {
      console.error("An error occurred while fetching farmers:", error);
    }
  }

  return { isUserListReady, getFarmers, farmers };
}
export function useChat() {
  const store = useStore();
  const getLatestChat = async () => {
    const lastMessage = ref<LastMessage[]>([]);
    const GetLatestChatUrl = "/api/v1/get-latest-conversation";
    try {
      const response = await axios.post(
        `${APIBaseUrl}${GetLatestChatUrl}`,
        {
          user_id: store?.loginUserList?.id,
          user_type: store.userType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        const UserChatData = response.data;
        if (UserChatData) {
          const farmerList: number[] = [];
          const specialistList: number[] = [];
          // Loop through the data array in the response
          for (const dataItem of UserChatData?.data?.consultation_details) {
            const farmerId = dataItem.farmer_id;
            const specialistId = dataItem.specialist_id;

            // Check if the id is not already in the array before pushing it
            if (!farmerList.includes(farmerId)) {
              farmerList.push(farmerId);
            }

            if (!specialistList.includes(specialistId)) {
              specialistList.push(specialistId);
            }
          }

          if (store.userType == "farmer") {
            await getSpecialist(specialistList);
            store.specialist = specialist.value;
          } else if (store.userType == "specialist") {
            getSpecialist(specialistList);
            await getFarmers(farmerList);
            store.farmer = farmers.value;
          }
          store.isThereUserList = isUserListReady.value;

          if (UserChatData?.data?.message.length > 0) {
            for (const dataItem of UserChatData?.data?.message) {
              const mutedChat = UserChatData?.data?.mute_Data?.filter(
                (m: LastMessage) =>
                  m.user_id == dataItem.receiver_id &&
                  m.consultation_id == dataItem.consultation_id &&
                  m.isMuted == 1,
              )[0];
              if (
                dataItem.message ==
                dataItem.sender_id +
                  " First Message send to " +
                  dataItem.receiver_id
              ) {
                const oldMessage: LastMessage = {
                  id: dataItem.id,
                  sender: dataItem.sender_id,
                  receiver_id: dataItem.receiver_id,
                  message: "send a message to start chat",
                  consultation_id: dataItem.consultation_id,
                  date: "--:--",
                  status: dataItem.status,
                  name: "Loading...",
                  lastname: "",
                  unread_message_count: dataItem.unread_message_count,
                  isMuted: mutedChat ? mutedChat.isMuted : null,
                  mutedDuration: mutedChat ? mutedChat.mute_duration : null,
                  mutedTime: mutedChat ? mutedChat.muted_time : null,
                };
                lastMessage.value.push(oldMessage);
              } else {
                const oldMessage: LastMessage = {
                  id: dataItem.id,
                  sender: dataItem.sender_id,
                  receiver_id: dataItem.receiver_id,
                  message: dataItem.message,
                  consultation_id: dataItem.consultation_id,
                  message_time: dataItem.created_at,
                  date: store.messageSentTime(dataItem.created_at?.toString()),
                  status: dataItem.status,
                  name: "Loading...",
                  lastname: "",
                  unread_message_count: dataItem.unread_message_count,
                  profile_image: dataItem.profile_image,
                  isMuted: mutedChat ? mutedChat.isMuted : null,
                  mutedDuration: mutedChat ? mutedChat.mute_duration : null,
                  mutedTime: mutedChat ? mutedChat.muted_time : null,
                };

                if (dataItem.media_files) {
                  if (dataItem.type === "image") {
                    oldMessage.message = "Media file";
                  }
                  if (dataItem.type === "audio") {
                    oldMessage.message = "Recording";
                  }
                  if (dataItem.type === "video") {
                    oldMessage.message = "Video";
                  }
                  if (dataItem.type === "doc") {
                    oldMessage.message = "Document";
                  }
                } else {
                  oldMessage.message = dataItem.message;
                }

                lastMessage.value.push(oldMessage);
              }
            }
            store.lastMessage = lastMessage.value;
          }
         store.isChatLoading = true; 

        }


      } 
      
      
      else {
        console.error(
          "Error fetching data:", response.status );
      }
    } catch (error) {
      console.error("An error occurred during the fetch operation:", error);
    }
  };

  return { getLatestChat };
}
export function updateStatus() {
  const store = useStore();
  const updateUserStatus = (status: string, userId: number) => {
    const updateMessageStatus = "/api/v1/conversations/update_user_status";
    fetch(`${APIBaseUrl}${updateMessageStatus}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        status: status,
        chatId: store.activeConversationId,
      }),
    });
  };
  return { updateUserStatus };
}
export function getUserStatusList() {
  const store = useStore();
  const getOnlineOfflineUsersList = async () => {
    const updateMessageStatus =
      "/api/v1/conversations/online_offline_user_list";

    try {
      const result = await axios.get(`${APIBaseUrl}${updateMessageStatus}`);
      if (result.data) {

        result.data.data.user_list.map((data: any) => {
          const isAvaiableUser = store.userStatus.find(
            (arrayData: UserStatus) => arrayData.user_id === data.user_id,
          );
          if (isAvaiableUser) {
            isAvaiableUser.user_id = data.user_id;
            isAvaiableUser.status = data.user_status;
            isAvaiableUser.ChatId = data.active_chat_id;
          } else {
            // Push a new object
            store.userStatus.push({
              user_id: data.user_id,
              status: data.user_status,
              ChatId: data.active_chat_id,
              updatedTime: new Date().toLocaleString(),
            });
          }
        });
      }
    } catch (err) {
      error.value = err;
    }
  };
  return { getOnlineOfflineUsersList };
}
