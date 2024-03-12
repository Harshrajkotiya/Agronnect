<script setup lang="ts">
import useStore from "@src/store/store";
import type { IUserData, UserStatus } from "@src/types";
import { computed, ref } from "vue";
import AccordionItem from "./AccordionItem.vue";
const store = useStore();
// For user profile
const props = defineProps(["activeConversation"]);
const profileData = ref<IUserData>();

const getCountry = (countryName: string) => {
  return countryName?.charAt(0).toUpperCase() + countryName?.slice(1);
};

if (store.userType === "specialist") {
  store.farmer?.filter((e: any) => {
    if (e.id === store.activeUserId) {
      profileData.value = e;
    }
  });
}

const croppedCrops = computed(() => {
  if (profileData.value?.crops) {
    if (Array.isArray(profileData.value.crops)) {
      return profileData.value?.crops?.map((crop) => crop.trim());
    } else if (typeof profileData.value.crops === "string") {
      return (profileData.value.crops as string)
        .split(",")
        .map((crop) => crop.trim())
        .filter(Boolean);
    }
  }
  return [];
});

const sortedSpecs = computed(() => {
  if (profileData.value?.specialties) {
    if (Array.isArray(profileData.value?.specialties)) {
      return profileData.value?.specialties.map((spec) => spec.trim());
    } else if (typeof profileData.value?.specialties === "string") {
      return (profileData.value?.specialties as string)
        .split(",")
        .map((spec) => spec.trim())
        .filter(Boolean);
    }
  }
  return [];
});

if (store.userType === "farmer") {
  store.specialist?.filter((e: any) => {
    if (e.id === store.activeSpecialistId) {
      profileData.value = e;
    }
  });
}

if (store.activeSidebarComponent === "archived") {
  store.farmer?.filter((e: any) => {
    if (e.id === store.activeConversationId) {
      profileData.value = e;
    }
  });
}

const languagesArray = ref<string[]>([]);
if (profileData.value?.languages) {
  languagesArray.value = [profileData.value?.languages];
  // languagesArray.value = ['Hungarian', 'English', 'Hindi', 'Georgian', 'Maths', 'Sanskrit'];
} else {
  languagesArray.value = [];
}

const isAvaiableUser = store.userStatus?.find(
  (arrayData: UserStatus) =>
    arrayData.user_id ===
    (store.userType === "farmer"
      ? store.activeSpecialistId
      : store.activeUserId),
);
</script>

<template>
  <div class="w-full xl:w-6/12 px-4 mx-auto lg:w-full">
    <div
      class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16"
    >
      <div class="xs:px-3 md:px-6 lg:px-6 xxl:px-8">
        <div class="flex flex-wrap justify-center">
          <div class="w-full px-4 flex justify-center">
            <div
              v-if="
                profileData?.profile_image === '' ||
                profileData?.profile_image === null
              "
              class="relative"
              alt="Network Error"
            >
              <img
                alt="Network Error"
                src="https://cdn-icons-png.flaticon.com/512/666/666201.png"
                class="rounded-lg h-auto align-middle border absolute -m-16 -ml-10 lg:-ml-16 max-w-[130px]"
              />
            </div>
            <div v-else class="relative">
              <img
                alt="Network Error"
                :src="profileData?.profile_image"
                class="rounded-lg h-auto align-middle border absolute -m-16 -ml-25 lg:-ml-16 max-w-[130px]"
              />
            </div>
          </div>
        </div>
        <div
          class="text-center xs:mt-[60%] min-[663px]:mt-[14%]"
        >
          <h3 class="text-[18px] text-[#344767] font-bold">
            {{ profileData?.name }} {{ profileData?.last_name }}
          </h3>
          <div
            v-if="isAvaiableUser"
            class="flex justify-center text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
          >
            <img
              src="/svg/UserProfileOnline.svg"
              alt="Network error"
              class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
            />
            <p class="text-center text-[12px]">
              {{ isAvaiableUser?.status?.toUpperCase() }}
            </p>
          </div>
          <div
            v-else
            class="flex justify-center text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
          >
            <img
              src="/svg/UserProfileOffline.svg"
              alt="Network error"
              class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
            />
            <p class="text-center text-[12px]">OFFLINE</p>
          </div>
        </div>

        <div
          :class="{
            'overflow-y-auto hide-scrollbar overflow-x-hidden':
              profileData?.user_role === 'specialist',
          }"
        >
          <div
            :class="
              profileData?.user_role === 'farmer'
                ? 'mx-5 mt-4 px-9 xs:px-0 pb-[70px]'
                : 'mx-5 h-[60vh] xs:h-[40vh] overflow-y-scroll overflow-x-hidden'
            "
          >
            <p
              class="text-[16px] font-bold text-[#344767]"
              v-if="profileData?.user_role === 'specialist'"
            >
              Personal Information
            </p>
            <p
              :class="
                profileData?.user_role === 'farmer'
                  ? 'text-[16px] font-bold text-[#344767] mt-6'
                  : 'text-[16px] font-bold text-[#344767] mt-4'
              "
            >
              Country
            </p>
            <p class="mt-1">{{ getCountry(profileData?.country || "") }}</p>
            <p class="text-[16px] font-bold text-[#344767] mt-6">
              Communication Language
            </p>

            <div
              class="flex mt-4 flex-wrap w-[120%]"
              v-if="profileData?.languages"
            >
              <div class="my-4">
                <img
                  src="/svg/UserProfileCommunication.svg"
                  alt="Network error"
                />
              </div>

              <div
                v-for="m in languagesArray"
                :key="m"
                class="bg-[#F8F9FA] px-3 my-2 mx-2 rounded-md"
              >
                <p class="p-3 text-center">{{ m }}</p>
              </div>
            </div>
            <div
              :class="profileData?.user_role === 'farmer' ? 'hidden' : 'block'"
            >
              <!-- CV Section -->
              <AccordionItem title="CV">
                <div class="flex mt-3">
                  <img
                    src="/svg/UserProfileCV.svg"
                    alt="Network error"
                    class="w-[23px]"
                  />
                  <a
                    :href="profileData?.cv"
                    download="download"
                    target="_blank"
                  >
                    <p class="cursor-pointer underline">
                      {{ profileData?.cv }}
                    </p></a
                  >
                </div>
              </AccordionItem>
              <hr class="mt-5 bg-[#E9ECEF]" />
              <!-- Specialities Section -->
              <AccordionItem title="Specialities">
                <template v-if="profileData?.specialties">
                  <div v-for="specs in sortedSpecs" :key="specs">
                    <p
                      class="mt-3 text-start px-3 py-3 mx-2 px-5 rounded-md bg-[#F8F9FA]"
                      style="width: fit-content"
                    >
                      {{ specs }}
                    </p>
                  </div>
                </template>
              </AccordionItem>
              <hr class="mt-5 bg-[#E9ECEF]" />
              <!-- Crops Section -->
              <AccordionItem title="Crops">
                <template v-if="profileData?.crops">
                  <div v-for="crop in croppedCrops" :key="crop" class="flex">
                    <img
                      src="/svg/UserProfileCrops.svg"
                      alt="Network error"
                      class="mt-3 w-[20px]"
                    />
                    <p class="mt-3 text-start px-3 py-2 mx-2">{{ crop }}</p>
                  </div>
                </template>
              </AccordionItem>
              <hr class="mt-5 bg-[#E9ECEF]" />

              <!-- Work Experience Section -->
              <AccordionItem title="Work Experience">
                <div class="flex mt-3">
                  <img
                    src="/svg/UserProfileExperience.svg"
                    alt="Network error"
                  />
                  <!-- <p class="mx-3">
                    Has worked for {{ profileData?.work_experience }} in
                    countries
                  </p> -->
                </div>
              </AccordionItem>
              <hr class="mt-5 bg-[#E9ECEF]" />

              <!-- About Section -->
              <AccordionItem title="About">
                <p class="mt-4">
                  {{ profileData?.about }}
                </p>
                <hr class="mt-5 bg-[#E9ECEF]" />
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  width: 0.1rem;
}
.hide-scrollbar::-webkit-scrollbar-track {
  display: none;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  display: none;
}
::-webkit-scrollbar {
  display: none;
}
</style>
