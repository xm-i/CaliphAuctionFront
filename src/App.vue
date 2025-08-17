<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Navbar style="position: sticky"></Navbar>
  <router-view />
  <Footer></Footer>
</template>
