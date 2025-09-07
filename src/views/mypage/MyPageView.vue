<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getMeSummary,
  NotificationDto,
  getWonItems,
  getBiddingItems,
} from "@/api/me";
import type { SearchItemDto } from "@/api/auction";
import AuctionItemCard from "@/components/AuctionItemCard.vue";
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import { usePointsBalanceStore } from "@/stores/pointsBalance";

// API 取得データ
const news = ref<NotificationDto[]>([]);
const totalSpent = ref<number>(0);
const points = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const wonItems = ref<SearchItemDto[]>([]);
const loadingItems = ref(false);
const itemsError = ref<string | null>(null);
const pointsBalanceStore = usePointsBalanceStore();

// ポイント購入画面をポップアップで開く
const router = useRouter();
const overlayActive = ref(false);
let pollId: number | null = null;

const clearPolling = () => {
  if (pollId != null) {
    window.clearInterval(pollId);
    pollId = null;
  }
};

onBeforeUnmount(() => {
  clearPolling();
});

// サマリー取得
const fetchSummary = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getMeSummary();
    points.value = data.pointBalance;
    totalSpent.value = data.totalSpentAmount;
    news.value = data.notifications;
    pointsBalanceStore.setBalance(data.pointBalance);
  } catch (e: any) {
    error.value = "サマリー取得に失敗しました";
  } finally {
    loading.value = false;
  }
};

const fetchWonItems = async () => {
  loadingItems.value = true;
  itemsError.value = null;
  try {
    const won = await getWonItems(6);
    wonItems.value = won.items;
  } catch {
    itemsError.value = "アイテム取得に失敗しました";
  } finally {
    loadingItems.value = false;
  }
};

// Realtime グリッド用 入札中一覧取得関数
const fetchBiddingItems = async () => {
  const res = await getBiddingItems(6);
  return res;
};

onMounted(() => {
  fetchSummary();
  fetchWonItems();
});

const openChargeWindow = () => {
  const width = 600;
  const height = 900;
  const dualLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualTop = window.screenTop ?? window.screenY ?? 0;
  const screenW =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const screenH =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;
  const left = dualLeft + (screenW - width) / 2;
  const top = dualTop + (screenH - height) / 2;
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  const win = window.open("/mypage/charge", "chargePointsWindow", features);
  // ポップアップブロックされた場合は通常遷移
  if (!win) {
    router.push({ name: "mypage-charge" });
  } else {
    win.focus();
    overlayActive.value = true; // マイページ操作不可
    clearPolling();
    pollId = window.setInterval(() => {
      if (win.closed) {
        overlayActive.value = false;
        clearPolling();
        fetchSummary();
      }
    }, 200);
  }
};
</script>

<template>
  <!-- グレーオーバーレイ（ポップアップ開いている間） -->
  <div
    v-if="overlayActive"
    class="fixed inset-0 z-[999] bg-background/70 dark:bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 select-none"
  >
    <div
      class="text-sm font-medium text-foreground/90 px-4 py-2 rounded-md bg-card/80 border shadow-sm"
    >
      ポイント購入ウィンドウを操作してください
    </div>
    <div class="text-xs text-muted-foreground">
      閉じると自動で操作可能になります…
    </div>
  </div>
  <section class="container lg:w-[90%] space-y-6 py-6">
    <h1 class="text-3xl font-bold">マイページ</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <!-- 所持ポイント / 利用金額合計 -->
      <div class="col-span-1 space-y-4 flex flex-col h-full">
        <div class="rounded-lg border p-4 bg-card">
          <h2 class="font-semibold mb-2">所持ポイント</h2>
          <p class="text-2xl">{{ points.toLocaleString() }} pt</p>
          <div class="mt-3">
            <Button @click="openChargeWindow">ポイント購入へ</Button>
          </div>
        </div>
        <div class="rounded-lg border p-4 bg-card">
          <h2 class="font-semibold mb-2">利用金額合計</h2>
          <p class="text-2xl">¥{{ totalSpent.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 新着情報 -->
      <div
        class="col-span-2 rounded-lg border p-4 bg-card flex flex-col max-h-72"
      >
        <h2 class="font-semibold mb-3">新着情報</h2>
        <div v-if="loading" class="text-sm text-muted-foreground py-2">
          読み込み中...
        </div>
        <div v-else-if="error" class="text-sm text-red-500 py-2">
          {{ error }}
        </div>
        <ul v-else class="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
          <li v-if="!news.length" class="text-sm text-muted-foreground py-1">
            新着情報はありません。
          </li>
          <li
            v-for="n in news"
            :key="n.id"
            class="flex flex-col gap-0.5 rounded border border-border/60 px-2 py-1.5 bg-background/50"
          >
            <div class="flex items-start justify-between gap-2">
              <span
                :class="[
                  'text-[13px]',
                  n.isRead ? 'opacity-60' : 'font-medium',
                ]"
              >
                {{ n.title }}
              </span>
              <span
                class="text-muted-foreground text-[10px] whitespace-nowrap leading-4"
              >
                {{
                  new Date(n.createdAt).toLocaleString("ja-JP", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </span>
            </div>
            <p
              class="text-[11px] leading-snug text-muted-foreground whitespace-pre-line"
            >
              {{ n.message }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <Separator />

    <!-- 落札商品 -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">落札商品</h2>
        <router-link :to="{ name: 'mypage-won' }" class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <AuctionItemCard v-for="w in wonItems" :key="w.id" :item="w" />
        <div
          v-if="!wonItems.length && !loadingItems && !itemsError"
          class="col-span-full text-sm text-muted-foreground py-4 text-center"
        >
          落札商品はまだありません。
        </div>
        <div
          v-if="itemsError"
          class="col-span-full text-sm text-red-500 py-4 text-center"
        >
          {{ itemsError }}
        </div>
      </div>
    </div>

    <!-- 入札中 -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">入札中</h2>
        <router-link
          :to="{ name: 'mypage-bidding' }"
          class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <AuctionItemRealtimeGrid
        :fetch-fn="fetchBiddingItems"
        :empty-message="'現在入札中の商品はありません。'"
      />
    </div>
  </section>
</template>
