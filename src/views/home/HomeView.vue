<script lang="ts" setup>
import { ref } from "vue";
import ItemComponent from "@/views/home/components/ItemComponent.vue";

const items = ref([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
]);
</script>

<template>
  <div class="home">
    <ul>
      <li v-for="item in items" :key="item.id">
        <item-component :item="item" />
      </li>
    </ul>
  </div>
</template>
