<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import ConnectionStatusOverlay from "./components/ConnectionStatusOverlay.vue";
import GlobalErrorToasts from "./components/GlobalErrorToasts.vue";

const route = useRoute();
const hideChrome = computed(() => route.meta?.blankLayout === true);
</script>

<template>
  <Navbar v-if="!hideChrome" class="mb-9" />
  <router-view />
  <Footer v-if="!hideChrome" />
  <ConnectionStatusOverlay />
  <GlobalErrorToasts />
</template>
