<script lang="ts" setup>
import AuctionItemCard from "@/components/AuctionItemCard.vue";
import type { SearchItemDto } from "@/api/auction";
import { ref, onMounted } from "vue";
import { searchAuctions, getAuctionItem } from "@/api/auction";
import { auctionHub, type BidUpdateDto } from "@/realtime/auctionHub";

const items = ref<SearchItemDto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchItems() {
  loading.value = true;
  error.value = null;
  try {
    const res = await searchAuctions();
    items.value = res.items;
    const ids = items.value.map((x) => x.id);
    await auctionHub.setVisibleItems(ids);
  } catch (e: any) {
    error.value = "取得に失敗しました";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchItems();
  auctionHub.onBidUpdate((dto: BidUpdateDto) => {
    const index = items.value.findIndex((x) => x.id === dto.auctionItemId);
    if (index >= 0) {
      const updated = { ...items.value[index] };
      updated.currentPrice = dto.currentPrice;
      updated.endTime = new Date(dto.endTime);
      updated.currentHighestBidUserId = dto.currentHighestBidUserId;
      updated.currentHighestBidUserName = dto.currentHighestBidUserName;
      items.value.splice(index, 1, updated);
    }
  });
});

async function refreshItem(id: number) {
  const index = items.value.findIndex((x) => x.id === id);
  if (index >= 0) {
    const fresh = await getAuctionItem(id);
    const updated = { ...items.value[index] };
    updated.currentPrice = fresh.currentPrice;
    updated.endTime = fresh.endTime;
    updated.currentHighestBidUserId = fresh.currentHighestBidUserId;
    updated.currentHighestBidUserName = fresh.currentHighestBidUserName;
    items.value.splice(index, 1, updated);
  }
}
</script>

<template>
  <div class="home">
    <section class="container lg:w-[90%] space-y-4">
      <div v-if="loading" class="text-center text-muted-foreground">
        読み込み中...
      </div>
      <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
      <div v-else>
        <div
          class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          <AuctionItemCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            @refresh="refreshItem"
          />
        </div>
        <div
          v-if="!items.length"
          class="text-center text-muted-foreground py-8"
        >
          商品が見つかりませんでした
        </div>
      </div>
    </section>
  </div>
</template>
