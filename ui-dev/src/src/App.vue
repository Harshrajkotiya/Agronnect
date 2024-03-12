<script setup lang="ts">
import FadeTransition from "@src/components/ui/transitions/FadeTransition.vue";
import { getUserStatusList, updateStatus, useChat } from '@src/composable/composableMethods';
import { postData } from "@src/composable/fetchData";
import { fetchData } from "@src/store/defaults";
import useStore from "@src/store/store";
import type { CheckTokenDetails } from "@src/types";
import axios from "axios";
import Cookies from "js-cookie";
import { onMounted, onUnmounted, ref } from "vue";

const { error } = postData();
const { getLatestChat} = useChat();
const {updateUserStatus} = updateStatus();
const {getOnlineOfflineUsersList} = getUserStatusList();
const store = useStore();

const LoginBaseUrl = import.meta.env.VITE_LOGIN_URL;
const apiUrl = import.meta.env.VITE_URL;
const loginUserData = ref<CheckTokenDetails | null>();
const tokenStatus = ref<number>();
const CheckTokenList = ref<CheckTokenDetails | null>(null);

// update localStorage with state changes
store.$subscribe((_mutation, state) => {
  localStorage.setItem("chat", JSON.stringify(state));
});

// here we load the data from the server.
onMounted(async () => {
  store.status = "loading";

  // fake server call
  setTimeout(() => {
    store.delayLoading = false;
  });
  const request = await fetchData();

  store.$patch({
    status: "success",
    user: request.data.user,
    conversations: request.data.conversations,
    notifications: request.data.notifications,
    archivedConversations: request.data.archivedConversations,
  });

});

// the app height
const height = ref(`${window.innerHeight}px`);
const resizeWindow = () => {
  height.value = `${window.innerHeight}px`;
};

// and add the resize event when the component mounts.
onMounted(() => {
  window.addEventListener("resize", resizeWindow);
  if (window.location.search != "undefined") {
    if (window.location.search.includes("?token=")) {
      const token = window.location.search.split("=")[1];
      getLoginUser(token); // Call the getLoginUser function with the token
    } else {
      window.location.href = `${LoginBaseUrl}`;
    }
  }
});

// remove the event when un-mounting the component.
onUnmounted(() => {
  window.removeEventListener("resize", resizeWindow);
});

const checkTokenMethod = async (url: string, userD: any) => {
  tokenStatus.value = undefined;
  try {
    const result = await axios.post(url, userD, {
      headers: {

        Authorization: 'Bearer ' + userD,
      }
    });
    if (result.data) {
      CheckTokenList.value = result.data.data;
      tokenStatus.value = result.data.status;
    }
  }
  catch (err) {
    error.value = err;
  }
}

async function getLoginUser(tokenString: string) {
  const checkTokenUrl = `${apiUrl}/auth/agronnect/check_token`;
  tokenStatus.value = undefined;

  await checkTokenMethod(checkTokenUrl, tokenString);

  loginUserData.value = CheckTokenList?.value;
  store.loginUserList = loginUserData.value;
  store.userType = loginUserData.value?.user_types;

  // auto_login

  if (tokenStatus.value === 500) {
    if(store?.loginUserList?.id){
      updateUserStatus("offline", store?.loginUserList?.id);
    }

    if (LoginBaseUrl != undefined && LoginBaseUrl != "") {
      window.location.href = `${LoginBaseUrl}`;
    } else {
      console.log("Login Url not defined");
    }
  } else if (CheckTokenList?.value) {
    Cookies.set("VITE_TOKEN", `${window.location.search.split("=")[1]}`);

    if(store?.loginUserList?.id){
      updateUserStatus("online", store?.loginUserList?.id);
    }
    
    getLatestChat();
    getOnlineOfflineUsersList();
    store.activeSidebarComponent = 'messages';
  }
}

</script>

<template>
  <div>
    <div :class="{ dark: store.settings.darkMode }">
      <div class="bg-white transition-colors duration-500" :style="{ height: height }">
        <router-view v-slot="{ Component }">
          <FadeTransition>
            <component :is="Component" />
          </FadeTransition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style>
@import "../node_modules/@fontsource/roboto/index.css";
</style>
