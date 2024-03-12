<script setup lang="ts">
import useStore from "@src/store/store";

import {
  BellIcon,
  Cog6ToothIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/vue/24/solid";
import NavLink from "@src/components/views/HomeView/Navigation/NavLink.vue";
const store = useStore();

// (event) change the active sidebar component when clicking on a NavLink
const handleActiveSidebarComponentChange = (value: string) => {
  store.activeSidebarComponent = value;
  store.activeConversationId = null;
};
</script>

<template>
  <div
    class="xs:w-full md:w-11 md:h-full md:py-7 xs:py-5 px-5 flex xs:flex-row md:flex-col lg:w-[30%] xl:w-[20%] transition-all duration-500 bg-[#038877] border rounded-md hidden"
  >
    <!--logo-->
    <div class="flex justify-center">
      <img src="/svg/logo.svg" alt="Network error" class="xl:w-[189px]" />
    </div>
    <hr class="mt-4 w-[90%] mx-auto" />

    <!--main navigation-->
    <div class="grow">
      <nav aria-label="Main navigation">
        <ul
          class="xs:flex md:block xs:justify-between xs:items-center text-white"
        >
          <!--settings button small screen-->
          <li
            class="flex my-4 hover:bg-[#00AB89] hover:rounded-md xl:px-2 lg:items-center hover:cursor-pointer focus:bg-[#00AB89] xl:tet-[1rem]"
            :class="{
              'bg-[#00AB89] border rounded-md border-[#00AB89]':
                store.activeSidebarComponent === 'dashboard',
            }"
          >
            <img src="/svg/Dashboard.svg" alt="Icon" class="lg:ml-3" />
            <NavLink
              :icon="Cog6ToothIcon"
              title="Dashboard"
              @click="() => handleActiveSidebarComponentChange('dashboard')"
              :active="store.activeSidebarComponent === 'dashboard'"
            />
          </li>

          <!--contacts list button-->
          <li
            class="flex my-4 hover:bg-[#00AB89] hover:rounded-md xl:px-2 lg:items-center hover:cursor-pointer focus:bg-[#00AB89]"
            :class="{
              'bg-[#00AB89] border rounded-md border-[#00AB89]':
                store.activeSidebarComponent === 'farms',
            }"
          >
            <img src="/svg/Farms.svg" alt="Icon" class="lg:ml-3" />
            <NavLink
              :icon="UserIcon"
              title="My Farms"
              @click="() => handleActiveSidebarComponentChange('farms')"
              :active="store.activeSidebarComponent === 'farms'"
            />
          </li>

          <!--notifications button-->
          <li
            class="flex my-4 hover:bg-[#00AB89] hover:rounded-md xl:px-2 lg:items-center hover:cursor-pointer focus:bg-[#00AB89]"
            :class="{
              'bg-[#00AB89] border rounded-md border-[#00AB89]':
                store.activeSidebarComponent === 'specialists',
            }"
          >
            <img src="/svg/Specialist.svg" alt="Icon" class="lg:ml-3" />
            <NavLink
              :icon="BellIcon"
              title="Find Specialists"
              @click="() => handleActiveSidebarComponentChange('specialists')"
              :active="store.activeSidebarComponent === 'specialists'"
            />
          </li>

          <!--voice call button-->
          <li
            class="flex my-4 hover:bg-[#00AB89] hover:rounded-md xl:px-2 lg:items-center hover:cursor-pointer focus:bg-[#00AB89]"
            :class="{
              'bg-[#00AB89] border rounded-md border-[#00AB89]':
                store.activeSidebarComponent === 'requests',
            }"
          >
            <img src="/svg/Requests.svg" alt="Icon" class="lg:ml-3" />
            <NavLink
              :icon="PhoneIcon"
              title="My Requests"
              @click="() => handleActiveSidebarComponentChange('requests')"
              :active="store.activeSidebarComponent === 'requests'"
            />
          </li>

          <!--message button-->
          <li
            class="flex my-4 hover:bg-[#00AB89] hover:rounded-md xl:px-2 lg:items-center hover:cursor-pointer focus:bg-[#00AB89]"
            :class="{
              'bg-[#00AB89] border rounded-md border-[#00AB89]':
                store.activeSidebarComponent === 'messages',
            }"
          >
            <img src="/svg/Chats.svg" alt="Icon" class="lg:ml-3" />
            <NavLink
              title="Chat"
              @click="() => handleActiveSidebarComponentChange('messages')"
              :active="store.activeSidebarComponent === 'messages'"
            />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
