<script setup lang="ts">
import { postData } from "@src/composable/fetchData";
import useStore from "@src/store/store";
import type { LastMessage, RadioItem } from "@src/types";
import { computed, reactive, ref } from "vue";
import { POSITION, useToast } from "vue-toastification";
const { postAllData, EndChatStatus } = postData();
const store = useStore();
const props = defineProps([
  "title",
  "subtitle",
  "cancelbtn",
  "submitbtn",
  "handleCloseModal",
  "optionsData",
  "bottomTitle",
]);
const toast = useToast();
const radioItems = ref<RadioItem[]>([
  { label: "8 Hours" },
  { label: "1 Week" },
  { label: "Until I turn it back on" },
]);

const selectedItem = ref<RadioItem | null>(null);
const selectedValueWithConversion = computed(() => {
  if (!selectedItem.value) {
    return null;
  }
  const { label } = selectedItem.value;
  if (label.includes("Until I turn it back on")) {
    return "always";
  }

  let numericValue = parseInt(label);
  if (label.includes("Week")) {
    numericValue *= 24 * 7;
  }
  return numericValue;
});

// For specialist
const specialistCheckbox = ref([
  { label: "Inappropriate language " },
  { label: "Lack of professionalism" },
  { label: "Providing inaccurate advice" },
  { label: "Unwanted solicitation" },
  { label: "Other" },
]);

const specialistSelecteditems = ref(Array.from({ length: specialistCheckbox.value?.length }, () => false));

const handleCheckboxClick = (index: number) => {
  const selectedValue = specialistCheckbox.value[index];
  if (index === 4 && selectedValue.label === "Other") {
    store.showTextbox = !store.showTextbox;
  }
};

const formattedSubtitle = computed(() => {
  const formattedText = props.subtitle.replace(/\n/g, `<br/><br/>`);
  return formattedText;
});

const APIBaseUrl = import.meta.env.VITE_API_BASE_URL;
const endChatUrl = `${APIBaseUrl}/api/v1/end-conversations`;
const archivedUrl = `${APIBaseUrl}/api/v1/archived-chat-user-list`;
const archivedData = reactive({
  user_id: store.loginUserList?.id,
  user_type: store.userType,
});
const endChatData = reactive({ consultation_id: store.activeConversationId });
const muteChatData = reactive({
  user_id: store.loginUserList?.id,
  user_type: store.userType,
  consultation_id: store.activeConversationId,
  mute_duration: selectedValueWithConversion,
});

const MuteUrl = `${APIBaseUrl}/api/v1/conversations/mute_notification`;

const handleOpenEndChat = async () => {
  props.handleCloseModal();
  await postAllData(endChatUrl, endChatData);
  if (EndChatStatus.value && EndChatStatus.value === 200) {
    store.EndChatStatusNumber = EndChatStatus.value;
    store.showEndChat = store.activeConversationId;

    store.lastMessage = store.lastMessage.filter(
      (message: LastMessage) =>
        message.consultation_id !== store.activeConversationId,
    );
    await postAllData(archivedUrl, archivedData);
    store.activeSidebarComponent = "archived";
    // store.activeConversationId = null;
  }
};

const formattedOptionsdata = computed(() => {
  const formattedOptions = props.optionsData?.replace(/\n/g, `<br/><br/>`);
  return formattedOptions;
});

async function handleMute() {
  if (selectedValueWithConversion.value == null) {
    toast.info("Please select Mute duration", {
      timeout: 3000,
      position: POSITION.TOP_CENTER,
      hideProgressBar: true,
      closeButton: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  } else {
    props.handleCloseModal();
    await postAllData(MuteUrl, muteChatData);
    if (EndChatStatus.value && EndChatStatus.value === 200) {
      store.lastMessage.map((e) => {
        if (e.consultation_id == store.activeConversationId) {
          e.isMuted = 1;
          store.isMute = true;
        }
      });
    }
  }
}

function handleCancel() {
  props.handleCloseModal()

  specialistSelecteditems.value = Array.from({ length: specialistCheckbox.value?.length }, () => false);
  selectedItem.value = null;
  store.showTextbox = false;

}
</script>

<template>
  <div
    class="w-full h-full py-6 flex flex-col items-center flex items-center justify-center"
  >
    <div
      :class="
        title === 'Mute Notifications'
          ? 'bg-white border border-gray-200 rounded-lg xxl:w-[450px] min-[767px]:w-[400px]'
          : 'bg-white border border-gray-200 rounded-lg xxl:w-[550px] min-[767px]:w-[400px]'
      "
      style="box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.25)"
    >
      <div class="text-start">
        <div class="flex justify-between mb-4 px-6 pt-6">
          <p class="font-bold text-[20px] text-[#343A40]">{{ title }}</p>
          <i
            class="fa-solid fa-xmark mt-1 cursor-pointer"
            @click="handleCloseModal()"
          ></i>
        </div>
        <hr />
        <p
          class="text-[#7B809A] text-[16px] mt-6 font-normal px-6"
          v-html="formattedSubtitle"
        ></p>
      </div>

      <div class="text-start w-[90%]">
        <p
          class="text-[#7B809A] text-[16px] mx-7 font-normal endChatListMarker"
          v-html="formattedOptionsdata"
        ></p>

        <p class="mx-6 mt-5 w-[100%] text-[#7B809A]">{{ bottomTitle }}</p>
      </div>

      <div class="w-full lg:mx-[30%] mx-6 mt-6">
        <div v-if="title === 'Mute Notifications'">
          <div
            v-for="(item, index) in radioItems"
            :key="index"
            class="flex items-center mb-4 mute-radios"
          >
            <input
              :id="'radio-' + index"
              type="radio"
              v-model="selectedItem"
              :value="item"
              class="w-5 h-5 muted focus:outline-none focus:ring-0"
            />
            <label
              :for="'radio-' + index"
              class="mx-4 text-[16px] text-[#7B809A]"
              >{{ item.label }}</label
            >
          </div>
        </div>

        <!-- Specialist -->
        <div v-else-if="title === 'Report Specialist'">
          <div
            v-for="(item, index) in specialistCheckbox"
            :key="index"
            class="flex items-center mb-4"
          >
            <input
              :id="'checkbox-' + index"
              type="checkbox"
              :name="'checkbox-' + index"
              v-model="specialistSelecteditems[index]"
              class="text-[#00AB89] bg-gray-100 border-gray-300 rounded-[20%] focus:outline-none focus:ring-0"
              @click="handleCheckboxClick(index)"
            />
            <label
              :for="'checkbox-' + index"
              class="mx-4 text-[16px] text-[#7B809A]"
              >{{ item.label }}</label
            >
          </div>
        </div>
      </div>

      <div v-if="store.showTextbox" class="flex justify-center">
        <textarea
          class="resize rounded-md border border-[#7B809A] h-[80px] ml-6 mt-4 p-[10px] focus:ring-0 focus:outline-none "
          placeholder="Please Specify"
        ></textarea>
      </div>

      <hr class="mt-5" />

      <div class="flex justify-center lg:justify-end mt-4 mb-4 lg:mx-6">
        <button
          type="button"
          class="mx-3 border rounded-md uppercase py-3 px-8 lg:px-5 shadow-lg text-[14px] font-semibold focus:outline-none focus:ring-0"
          @click="handleCancel()"
        >
          {{ cancelbtn }}
        </button>
        <button
          v-if="title === 'End Chat Confirmation'"
          type="button"
          class="bg-[#00AB89] text-white border px-8 rounded-md uppercase py-3 lg:px-5 shadow-lg text-[14px] font-medium focus:outline-none focus:ring-0"
          @click="handleOpenEndChat()"
        >
          {{ submitbtn }}
        </button>

        <button
          v-else-if="title === 'Mute Notifications'"
          type="button"
          class="bg-[#00AB89] text-white border px-8 rounded-md uppercase py-3 lg:px-5 shadow-lg text-[14px] font-medium focus:outline-none focus:ring-0"
          @click="handleMute()"
        >
          {{ submitbtn }}
        </button>

        <button
          v-else-if="title === 'Report Specialist'"
          type="button"
          class="bg-[#00AB89] text-white border px-8 rounded-md uppercase py-3 lg:px-5 shadow-lg text-[14px] font-medium focus:outline-none focus:ring-0"
          
        >
          {{ submitbtn }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.muted {
  position: relative;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #7B809A !important; 
  outline: none;
}
input[type="radio"]:before {
  content: "";
  display: block;
  width: 61%;
  height: 68%;
  margin: 20% auto;
  border-radius: 50%;
  background: transparent;
}
input[type="radio"]:checked:before {
  background: #00ab89;
  height: -webkit-fill-available;
}
input[type="radio"]:checked {
  background: none;
  border: 2px solid #00ab89 !important;
}
.focus\:outline-none:focus {
  --tw-ring-color: #7B809A;
  border-color: #7B809A;
}
</style>