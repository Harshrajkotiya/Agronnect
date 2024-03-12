import router from "@src/router";
import "@src/style.css";
import vClickOutside from "click-outside-vue3";
import { createPinia } from "pinia";
import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "@src/App.vue";
import { PluginOptions } from "vue-toastification/src/types";

const options: PluginOptions = {
  transition: "Vue-Toastification__fade",
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false;
    }
    return toast;
  },
};

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .use(vClickOutside)
  .use(Toast, options)
  .mount("#app");
