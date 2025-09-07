<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { SearchItemDto } from "@/api/auction";
import {
  searchAuctions,
  type SearchResponse,
  getAuctionItem,
  AuctionStatus,
} from "@/api/auction";
import AuctionItemCard from "@/components/AuctionItemCard.vue";
import {
  auctionHub,
  type BidUpdateDto,
  type AuctionClosedDto,
} from "@/realtime/auctionHub";

const props = withDefaults(
  defineProps<{
    fetchFn?: () => Promise<SearchResponse>;
    gridClass?: string;
    emptyMessage?: string | null;
  }>(),
  {
    fetchFn: () => searchAuctions(),
    gridClass:
      "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
    emptyMessage: "商品が見つかりませんでした",
  }
);

const items = ref<SearchItemDto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await props.fetchFn();
    items.value = res.items;
  } catch {
    error.value = "取得に失敗しました";
  } finally {
    loading.value = false;
  }
}

let unbindUpdate: (() => void) | null = null;
let unbindClosed: (() => void) | null = null;

async function refreshItem(id: number) {
  const index = items.value.findIndex((x) => x.id === id);
  if (index < 0) {
    return;
  }
  const fresh = await getAuctionItem(id);
  const updated = { ...items.value[index] };
  updated.currentPrice = fresh.currentPrice;
  updated.endTime = fresh.endTime;
  updated.currentHighestBidUserId = fresh.currentHighestBidUserId;
  updated.currentHighestBidUserName = fresh.currentHighestBidUserName;
  updated.status = fresh.status;
  items.value.splice(index, 1, updated);
}

function attachHubHandlers() {
  unbindUpdate = auctionHub.onBidUpdate((dto: BidUpdateDto) => {
    const index = items.value.findIndex((x) => x.id === dto.auctionItemId);
    if (index < 0) {
      return;
    }
    const updated = { ...items.value[index] };
    updated.currentPrice = dto.currentPrice;
    updated.endTime = new Date(dto.endTime);
    updated.currentHighestBidUserId = dto.currentHighestBidUserId;
    updated.currentHighestBidUserName = dto.currentHighestBidUserName;
    items.value.splice(index, 1, updated);
  });

  unbindClosed = auctionHub.onAuctionClosed(
    async (closed: AuctionClosedDto) => {
      const index = items.value.findIndex((x) => x.id === closed.auctionItemId);
      if (index < 0) {
        return;
      }
      const current = items.value[index];
      if (current?.status === AuctionStatus.Ended) {
        return;
      }
      await refreshItem(closed.auctionItemId);
    }
  );
}

function detachHubHandlers() {
  if (unbindUpdate) unbindUpdate();
  if (unbindClosed) unbindClosed();
  unbindUpdate = null;
  unbindClosed = null;
}

async function onRefresh(id: number) {
  await refreshItem(id);
}

onMounted(async () => {
  await load();
  await auctionHub.setVisibleItems(items.value.map((x) => x.id));
  attachHubHandlers();
});

onUnmounted(() => {
  detachHubHandlers();
});

defineExpose({
  reload: async () => {
    await load();
    await auctionHub.setVisibleItems(items.value.map((x) => x.id));
  },
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center text-muted-foreground">
      読み込み中...
    </div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <div :class="props.gridClass">
        <AuctionItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @refresh="onRefresh(item.id)"
        />
      </div>
      <div
        v-if="!items.length && props.emptyMessage"
        class="text-center text-muted-foreground py-8"
      >
        {{ props.emptyMessage }}
      </div>
    </div>
  </div>
</template>
