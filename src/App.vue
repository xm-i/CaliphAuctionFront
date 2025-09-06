<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
const hideChrome = computed(() => route.meta?.blankLayout === true);
</script>

<template>
  <Navbar v-if="!hideChrome" class="mb-9" />
  <router-view />
  <Footer v-if="!hideChrome" />
</template>
