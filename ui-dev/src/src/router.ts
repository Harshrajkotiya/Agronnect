import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@src/components/views/HomeView/HomeView.vue";
import  App from "@src/App.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  // {
  //   path: "/",
  //   name: "Home",
  //   component: App,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
