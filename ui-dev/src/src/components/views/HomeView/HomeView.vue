<script setup lang="ts">
import Navigation from "@src/components/views/HomeView/Navigation/Navigation.vue";
import Sidebar from "@src/components/views/HomeView/Sidebar/Sidebar.vue";
import useStore from "@src/store/store";
import Loading3 from "@src/components/states/loading-states/Loading3.vue";

const store = useStore();

// App 
import { getUserStatusList, updateStatus, useChat } from '@src/composable/composableMethods';
import { postData } from "@src/composable/fetchData";
import { fetchData } from "@src/store/defaults";
import type { CheckTokenDetails,LastMessage } from "@src/types";
import axios from "axios";
import Cookies from "js-cookie";
import { onMounted, onUnmounted, ref } from "vue";

const { error } = postData();
const LoginBaseUrl = import.meta.env.VITE_LOGIN_URL;
const apiUrl = import.meta.env.VITE_URL;
const loginUserData = ref<CheckTokenDetails | null>();
const tokenStatus = ref<number>();
const CheckTokenList = ref<CheckTokenDetails | null>(null);
const { getLatestChat } = useChat();
const { updateUserStatus } = updateStatus();
const { getOnlineOfflineUsersList } = getUserStatusList();

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

    const matched = !!store.lastMessage.find((e: LastMessage) => e.consultation_id === store.activeConversationId && e.isMuted === 1);

    if (matched) {
      store.isMute = true;
    } else {
      store.isMute = false;
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

  if (tokenStatus.value === 500) {
    store?.loginUserList?.id ? updateUserStatus("offline", store?.loginUserList?.id) : '';
    if (LoginBaseUrl != undefined && LoginBaseUrl != "") {
      window.location.href = `${LoginBaseUrl}`;
    } else {
      console.log("Login Url not defined");
    }
  } else if (CheckTokenList?.value) {
    Cookies.set("VITE_TOKEN", `${window.location.search.split("=")[1]}`);
    if (store.farmer?.length === 0) {
      store?.loginUserList?.id ? updateUserStatus("online", store?.loginUserList?.id) : '';
      await getLatestChat();
      getOnlineOfflineUsersList();
    }
  }
}

</script>

<template>
 <div v-if="store.delayLoading || store.status=== 'loading'" class="flex justify-center ">
    <Loading3 />
  </div>
  
  
  <KeepAlive v-else>
    <div v-if="store.loginUserList !== undefined" class=" xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden ">

      <!--navigation-bar-->
      <Navigation class="xs:order-1 md:-order-none" />
      <div class="flex w-full flex-col">
        <div class="lg:h-[8%] bg-[#FFFCFA] hidden">
          <div class="flex w-[95%] justify-between hidden lg:flex">
            <div>
              <div class="flex mt-5 mx-9 items-center" v-if="store.activeSidebarComponent === 'messages' || store.activeSidebarComponent === 'archived'">
                <i class="fa-solid fa-chevron-right mt-1 text-[#00AB89]"></i>
                <p class="text-[1.6rem] font-bold mx-4 font-roboto-slab">
                  Chat
                </p>
              </div>
              <div class="flex mt-5 mx-9 items-center" v-else-if="store.activeSidebarComponent === 'phone'">
                <i class="fa-solid fa-chevron-right mt-1 text-[#00AB89]"></i>
                <p class="text-[1.6rem] font-bold mx-4 font-roboto-slab">
                  Calls
                </p>
              </div>
            </div>
            <div class="flex mt-5">
              <a href="#" class="notification">
                <i class="fa-regular fa-bell py-4 px-3 border-gray-400 relative text-[1.4rem]"></i>
                <span class="badge rounded-lg px-4">3</span>
              </a>
              <hr class="bg-[#E9ECEF] w-[1px] h-[5vh]" />
              <p class="px-6 mt-3 font-bold">Hi, {{ CheckTokenList?.name }}</p>

              <div class="flex items-center border border-[#00AB89] px-5 font-roboto rounded-md h-[5vh]">
                <img src="/svg/UserIcon.svg" alt="Network Error">

                <p class="text-[0.9rem] text-[#00AB89] mx-4 font-bold">
                  {{ CheckTokenList?.user_types.toUpperCase() }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex w-[100%] justify-between flex lg:hidden">
            <div class="mt-6 mx-6">
              <i class="fa-solid fa-bars text-[#00AB89] text-xl"></i>
            </div>

            <div class="flex mt-5 mx-4">
              <i class="fa-regular fa-bell py-4 px-7 border-gray-400 relative text-[1.4rem]"></i>
              <hr class="bg-[#E9ECEF] w-[1px] h-[40px]" />
              <p class="absolute bg-[#FD3333] text-white rounded-lg py-1 px-4 text-[0.6rem] right-[75px] top-[2%]">
                11
              </p>

              <div class="flex border border-[#00AB89] px-2 font-roboto rounded-md ml-5 h-[fit-content] p-[3%] mt-2">

                <img src="/svg/UserIcon.svg" alt="Network Error">
              </div>

            </div>
          </div>
        </div>
        <div class="w-full flex h-full">
          <!--sidebar-->
          <Sidebar class="xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden" />
        </div>
      </div>
    </div>
  </KeepAlive>
 
</template>
<style>
.notification {
  background-color: white;
  text-decoration: none;
  position: relative;
  display: inline-block;
  border-radius: 2px;
  margin-right: 20px;
}

.notification .badge {
  position: absolute;
  top: 5px;
  right: -10px;
  font-size: 11px;
  background-color: red;
  color: white;
}
</style>