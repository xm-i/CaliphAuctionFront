import { createApp } from "vue";
import autoAnimate, { AutoAnimateOptions } from "@formkit/auto-animate";
import App from "./App.vue";
import "./assets/index.css";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
app.directive("auto-animate", (el, binding) => {
  if ((el as any).__autoAnimateInitialized) return;
  const defaultOptions: Partial<AutoAnimateOptions> = {
    duration: 600,
    easing: "ease-in-out",
  };
  // Allow overriding via binding value: v-auto-animate="{ duration: 250 }"
  let userOpts: Partial<AutoAnimateOptions> = {};
  if (binding && typeof binding.value === "object" && binding.value) {
    userOpts = binding.value as Partial<AutoAnimateOptions>;
  }
  autoAnimate(el as HTMLElement, { ...defaultOptions, ...userOpts });
  (el as any).__autoAnimateInitialized = true;
});
app.use(createPinia());
app.use(router);
app.mount("#app");
