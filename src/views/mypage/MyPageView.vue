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

// API 取得データ
const news = ref<NotificationDto[]>([]);
const totalSpent = ref<number>(0);
const points = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const wonItems = ref<SearchItemDto[]>([]);
const biddingItems = ref<SearchItemDto[]>([]);
const loadingItems = ref(false);
const itemsError = ref<string | null>(null);

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
  } catch (e: any) {
    error.value = "サマリー取得に失敗しました";
  } finally {
    loading.value = false;
  }
};

// 落札/入札中アイテム取得
const fetchMyPageItems = async () => {
  loadingItems.value = true;
  itemsError.value = null;
  try {
    const [won, bidding] = await Promise.all([
      getWonItems(5),
      getBiddingItems(5),
    ]);
    wonItems.value = won.items;
    biddingItems.value = bidding.items;
  } catch (e: any) {
    itemsError.value = "アイテム取得に失敗しました";
  } finally {
    loadingItems.value = false;
  }
};

onMounted(() => {
  fetchSummary();
  fetchMyPageItems();
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 所持ポイント / 利用金額合計 -->
      <div class="col-span-1 space-y-4">
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
      <div class="col-span-2 rounded-lg border p-4 bg-card">
        <h2 class="font-semibold mb-3">新着情報</h2>
        <div v-if="loading" class="text-sm text-muted-foreground py-2">
          読み込み中...
        </div>
        <div v-else-if="error" class="text-sm text-red-500 py-2">
          {{ error }}
        </div>
        <ul v-else class="space-y-2">
          <li v-if="!news.length" class="text-sm text-muted-foreground py-1">
            新着情報はありません。
          </li>
          <li
            v-for="n in news"
            :key="n.id"
            class="flex justify-between items-start gap-3"
          >
            <span
              :class="['text-sm', n.isRead ? 'opacity-70' : 'font-semibold']"
            >
              {{ n.title }}
            </span>
            <span
              class="text-muted-foreground text-xs whitespace-nowrap mt-0.5"
            >
              {{ n.createdAt.getDate() }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <Separator />

    <!-- 落札商品（5件） -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">落札商品</h2>
        <router-link :to="{ name: 'mypage-won' }" class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="w in wonItems.slice(0, 5)"
          :key="w.id"
          class="rounded-md border p-3 bg-card"
        >
          <p class="font-medium line-clamp-1">{{ w.name }}</p>
          <p class="text-sm text-muted-foreground">
            ¥{{ w.currentPrice.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- 入札中（5件） -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">入札中</h2>
        <router-link
          :to="{ name: 'mypage-bidding' }"
          class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="b in biddingItems.slice(0, 5)"
          :key="b.id"
          class="rounded-md border p-3 bg-card"
        >
          <p class="font-medium line-clamp-1">{{ b.name }}</p>
          <p class="text-sm text-muted-foreground">
            現在 ¥{{ b.currentPrice.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
