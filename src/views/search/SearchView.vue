<script setup lang="ts">
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import { searchAuctions } from "@/api/auction";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();

async function fetchAll() {
  const categoryId = route.query.categoryId as string | undefined;
  return await searchAuctions({
    categoryId: categoryId ? Number(categoryId) : undefined,
  });
}

const gridRef = ref<InstanceType<typeof AuctionItemRealtimeGrid> | null>(null);

watch(
  () => route.query.categoryId,
  async () => {
    await gridRef.value?.reload();
  }
);
</script>

<template>
  <section class="container lg:w-[90%] py-6 space-y-8">
    <h1 class="text-3xl font-bold">検索</h1>
    <AuctionItemRealtimeGrid
      ref="gridRef"
      :fetch-fn="fetchAll"
      :empty-message="'商品がありません。'"
    />
  </section>
</template>

<style scoped></style>
