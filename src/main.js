import { createApp } from "vue";
import { createPinia } from "pinia";
import logger from "./logger";
import router from "./router";
import UUID from "vue-uuid";

import "./style.css";

import App from "./App.vue";
const pinia = createPinia();
const app = createApp(App).use(logger).use(router).use(pinia).use(UUID);
app.use(pinia);

app.mount("#app");
