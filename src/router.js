import { createRouter, createWebHistory } from "vue-router";

import ConfigModal from "@/components/ConfigModal.vue";
import RunningHover from "@/components/RunningHover.vue";
import RunningModal from "@/components/RunningModal.vue";

const routes = [
  { path: "/", name: "home", component: ConfigModal },
  { path: "/hover", name: "hover", component: RunningHover },
  { path: "/modal", name: "modal", component: RunningModal },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
