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
    maxCount?: number | null;
    gridClass?: string;
    emptyMessage?: string | null;
  }>(),
  {
    fetchFn: () => searchAuctions(),
    maxCount: null,
    gridClass:
      "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
    emptyMessage: "商品が見つかりませんでした",
  }
);

const items = ref<SearchItemDto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const lastUpdated = ref<Date | null>(null);

const removalTimers = new Map<number, number>();

let refilling = false;

function scheduleRemovalIfEnded() {
  var endedItems = items.value.filter(
    (x) => x.status == AuctionStatus.Ended && !removalTimers.has(x.id)
  );

  const handle = window.setTimeout(() => {
    for (var item of endedItems) {
      removalTimers.delete(item.id);
    }

    removeItemAndRefill(endedItems);
  }, 20_000);
  for (var item of endedItems) {
    removalTimers.set(item.id, handle);
  }
}

function removeItemAndRefill(endedItems: SearchItemDto[]) {
  for (const item of endedItems) {
    const index = items.value.findIndex((x) => x.id === item.id);
    if (index >= 0) {
      items.value.splice(index, 1);
    }
  }
  doRefill();
}

async function doRefill() {
  if (refilling) {
    return;
  }
  if (props.maxCount !== null && items.value.length >= props.maxCount) {
    return;
  }
  refilling = true;
  try {
    const res = await props.fetchFn();
    const existingIds = new Set(items.value.map((x) => x.id));
    const capacityLeft =
      props.maxCount === null ? Infinity : props.maxCount - items.value.length;
    if (capacityLeft <= 0) {
      return;
    }
    const toAdd: SearchItemDto[] = [];
    for (const it of res.items) {
      if (existingIds.has(it.id)) {
        continue;
      }
      toAdd.push(it);
      if (toAdd.length >= capacityLeft) {
        break;
      }
    }
    if (toAdd.length > 0) {
      items.value.push(...toAdd);
      void auctionHub.setVisibleItems(items.value.map((x) => x.id));
    }
  } finally {
    refilling = false;
  }
}

function clearAllRemovalTimers() {
  removalTimers.forEach((h) => window.clearTimeout(h));
  removalTimers.clear();
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await props.fetchFn();
    items.value = res.items;
    lastUpdated.value = new Date();
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

  scheduleRemovalIfEnded();
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
  clearAllRemovalTimers();
});

async function reloadAll() {
  await load();
  await auctionHub.setVisibleItems(items.value.map((x) => x.id));
}

defineExpose({ reload: reloadAll });
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-end gap-4">
      <button
        type="button"
        @click="reloadAll"
        class="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-accent/50 hover:text-accent-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none"
        :disabled="loading"
        aria-label="再読み込み"
      >
        <svg
          class="w-4 h-4"
          :class="loading ? 'animate-spin' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
          <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
        </svg>
        <span class="hidden sm:inline" v-if="!loading">再読み込み</span>
        <span class="hidden sm:inline" v-else>更新中…</span>
      </button>
    </div>
    <div v-if="loading" class="text-center text-muted-foreground">
      読み込み中...
    </div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <div :class="props.gridClass" v-auto-animate>
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
