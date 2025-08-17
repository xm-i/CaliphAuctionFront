<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Navbar class="mb-9"></Navbar>
  <router-view />
  <Footer></Footer>
</template>
