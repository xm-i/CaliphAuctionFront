import { createApp } from "vue";
import autoAnimate from "@formkit/auto-animate";
import App from "./App.vue";
import "./assets/index.css";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
app.directive("auto-animate", (el) => {
  if (!(el as any).__autoAnimateInitialized) {
    autoAnimate(el as HTMLElement);
    (el as any).__autoAnimateInitialized = true;
  }
});
app.use(createPinia());
app.use(router);
app.mount("#app");
