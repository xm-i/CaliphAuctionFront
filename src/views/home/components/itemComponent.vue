<script setup lang="ts">
defineProps<{
  item: { id: number; name: string };
}>();
</script>

<template>
  <span>{{ item.id }}</span>
  <span>{{ item.name }}</span>
</template>
