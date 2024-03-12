import { ref } from "vue";
import axios from "axios";
import Cookies from 'js-cookie';

import type { IUserData, IConversation, IArchiveData } from "@src/types";

const apiUrl = import.meta.env.VITE_URL;
const XApiKey = import.meta.env.VITE_HEADERS_API_KEY;
const tokenn = Cookies.get('VITE_TOKEN');

const headers = {
  Authorization: 'Bearer' + tokenn,
};

export function getData() {
  const allUsersData = ref<IUserData[]>([]);
  const error = ref<null | unknown>(null);
  const getUserData = async (urlEndPoint: string) => {
    try {
      const result = await axios.get(`${apiUrl}/${urlEndPoint}`, {
        headers: headers,
      });
      allUsersData.value = result.data;
    } catch (err) {
      error.value = err;
    }
  };
  return { error, getUserData, allUsersData };
}

export function postData() {
  const postEntityData = ref<IConversation[] | null>(null);
  const farmerList = ref<IUserData[] | null>(null);
  const EndChatStatus = ref<number>();
  const ArchivedDataMessage = ref<IArchiveData[] | null>(null);
  const error = ref<null | unknown>(null);

  const postAllData = async (url: string, userD: any) => {
    EndChatStatus.value = undefined;
    try {
      const result = await axios.post(url, userD, {
        headers: {
          'x-api-key': XApiKey,
          Authorization: 'Bearer ' + tokenn,
        }
      });
      if (result.data) {
        postEntityData.value = result.data.data;
        farmerList.value = result.data;
        EndChatStatus.value = result.data.status;
        ArchivedDataMessage.value = result.data.data.message;
      }
    }
    catch (err) {
      error.value = err;
    }
  }
  return { postAllData, postEntityData, EndChatStatus, farmerList, ArchivedDataMessage, error }
}

export function putData() {
  const updateEntityDataResponse = ref<IConversation[] | null>(null);
  const updateEntityDataStatus = ref<number>();
  const error = ref<null | unknown>(null);

  const updateAllData = async (url: string, userD: any) => {
    updateEntityDataStatus.value = undefined;
    try {
      const result = await axios.put(url, userD, {
        headers: {
          'x-api-key': XApiKey,
          Authorization: 'Bearer ' + tokenn,
        }
      });
      if (result.data) {
        updateEntityDataResponse.value = result.data.data;
        updateEntityDataStatus.value = result.data.status;
      }
    }
    catch (err) {
      error.value = err;
    }
  }
  return { updateAllData, updateEntityDataResponse, updateEntityDataStatus, error }
}