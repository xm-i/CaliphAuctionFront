<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import {
  getMeSummary,
  NotificationDto,
  getWonItems,
  getBiddingItems,
} from "@/api/me";
import type { SearchItemDto } from "@/api/auction";
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import { usePointsBalanceStore } from "@/stores/pointsBalance";

// Stores & Auth
const { user, ensureUserLoaded } = useAuth();
const pointsBalanceStore = usePointsBalanceStore();

// State
const news = ref<NotificationDto[]>([]);
const totalSpent = ref<number>(0);
const points = ref<number>(0);
const loadingSummary = ref<boolean>(false);
const loadingNotifications = ref<boolean>(false);
const errorSummary = ref<string | null>(null);
const errorNotifications = ref<string | null>(null);

const wonItems = ref<SearchItemDto[]>([]);
const loadingWon = ref(false);
const itemsError = ref<string | null>(null);

// Goal / progress
const spendingGoal = 200000;
const spendingProgress = computed(() => {
  if (!spendingGoal) return 0;
  return Math.min(totalSpent.value / spendingGoal, 1);
});
const spendingProgressPercent = computed(() =>
  Math.round(spendingProgress.value * 100)
);

// Notifications helpers
const unreadCount = computed(() => news.value.filter((n) => !n.isRead).length);

// Popup overlay state
const router = useRouter();
const overlayActive = ref(false);
let pollId: number | null = null;

const clearPolling = () => {
  if (pollId != null) {
    window.clearInterval(pollId);
    pollId = null;
  }
};

onBeforeUnmount(() => clearPolling());

// Summary & notifications
const fetchSummary = async () => {
  loadingSummary.value = true;
  errorSummary.value = null;
  try {
    const data = await getMeSummary();
    points.value = data.pointBalance;
    totalSpent.value = data.totalSpentAmount;
    pointsBalanceStore.setBalance(data.pointBalance);
  } catch (e) {
    errorSummary.value = "サマリー取得に失敗しました";
  } finally {
    loadingSummary.value = false;
  }
};

const fetchNotifications = async () => {
  loadingNotifications.value = true;
  errorNotifications.value = null;
  try {
    const data = await getMeSummary();
    news.value = data.notifications;
  } catch (e) {
    errorNotifications.value = "新着情報の取得に失敗しました";
  } finally {
    loadingNotifications.value = false;
  }
};

const refreshAll = () => {
  fetchSummary();
  fetchNotifications();
  fetchWonItems();
};

const fetchWonItems = async () => {
  loadingWon.value = true;
  itemsError.value = null;
  try {
    const won = await getWonItems(6);
    wonItems.value = won.items;
  } catch {
    itemsError.value = "落札商品取得に失敗しました";
  } finally {
    loadingWon.value = false;
  }
};

const fetchBiddingItems = async () => {
  return await getBiddingItems(6);
};

onMounted(() => {
  ensureUserLoaded?.();
  refreshAll();
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
  if (!win) {
    router.push({ name: "mypage-charge" });
  } else {
    win.focus();
    overlayActive.value = true;
    clearPolling();
    pollId = window.setInterval(() => {
      if (win.closed) {
        overlayActive.value = false;
        clearPolling();
        refreshAll();
      }
    }, 200);
  }
};

const shortUser = () => {
  if (!user?.value) {
    return;
  }
  return user.value.username;
};

const formatDateTime = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
<template>
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
  <section class="container lg:w-[90%] space-y-10 py-6">
    <!-- Header / User Summary -->
    <div class="flex flex-col md:flex-row md:items-end gap-4 justify-between">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
          マイページ
          <span class="text-base font-medium text-muted-foreground"
            >{{ shortUser() }} さん</span
          >
        </h1>
        <p class="text-sm text-muted-foreground">
          アカウントの状態とアクティビティを確認できます。
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          @click="refreshAll"
          :disabled="loadingSummary || loadingNotifications"
          >再読み込み</Button
        >
        <Button size="sm" @click="openChargeWindow">ポイント購入</Button>
      </div>
    </div>

    <!-- Top Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
      <!-- Points & Spent Card + Quick Actions -->
      <div class="flex flex-col gap-6">
        <Card class="relative overflow-hidden">
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-fuchsia-400/10"
          ></div>
          <CardHeader class="pb-2 relative z-10">
            <CardTitle class="text-lg">ポイント & 利用状況</CardTitle>
          </CardHeader>
          <CardContent class="space-y-6 relative z-10">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs text-muted-foreground">所持ポイント</span>
                <span
                  class="text-2xl font-semibold tabular-nums"
                  v-if="!loadingSummary"
                  >{{ points.toLocaleString()
                  }}<span class="text-sm ml-1">pt</span></span
                >
                <span
                  v-else
                  class="h-7 w-24 rounded bg-muted animate-pulse"
                ></span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs text-muted-foreground">利用金額合計</span>
                <span
                  class="text-2xl font-semibold tabular-nums"
                  v-if="!loadingSummary"
                  >¥{{ totalSpent.toLocaleString() }}</span
                >
                <span
                  v-else
                  class="h-7 w-28 rounded bg-muted animate-pulse"
                ></span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button size="sm" class="flex-1" @click="openChargeWindow"
                >チャージ</Button
              >
            </div>
            <div class="space-y-2">
              <div
                class="flex justify-between text-[11px] text-muted-foreground"
              >
                <span>次の特典まで</span>
                <span>{{ spendingProgressPercent }}%</span>
              </div>
              <div class="h-2 rounded bg-muted/60 overflow-hidden">
                <div
                  class="h-full bg-primary/70 transition-all duration-500"
                  :style="{ width: spendingProgressPercent + '%' }"
                ></div>
              </div>
            </div>
            <p v-if="errorSummary" class="text-xs text-red-500">
              {{ errorSummary }}
            </p>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card class="border-dashed">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium tracking-wide"
              >クイック操作</CardTitle
            >
          </CardHeader>
          <CardContent class="pt-0">
            <div class="grid grid-cols-2 gap-3 text-xs">
              <Button
                size="sm"
                variant="secondary"
                @click="openChargeWindow"
                class="justify-center"
                >ポイント購入</Button
              >
              <router-link
                :to="{ name: 'mypage-bidding' }"
                class="inline-flex items-center justify-center rounded-md border bg-background hover:bg-muted transition px-2 py-2"
                >入札中一覧</router-link
              >
              <router-link
                :to="{ name: 'mypage-won' }"
                class="inline-flex items-center justify-center rounded-md border bg-background hover:bg-muted transition px-2 py-2"
                >落札一覧</router-link
              >
              <router-link
                :to="{ name: 'search' }"
                class="inline-flex items-center justify-center rounded-md border bg-background hover:bg-muted transition px-2 py-2"
                >商品検索</router-link
              >
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Notifications Card -->
      <Card class="xl:col-span-2 flex flex-col max-h-[430px]">
        <CardHeader class="pb-3 flex flex-row items-center justify-between">
          <CardTitle class="text-lg flex items-center gap-2"
            >新着情報
            <span
              v-if="unreadCount"
              class="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/15 text-primary"
            >
              {{ unreadCount }}</span
            ></CardTitle
          >
          <div class="flex gap-2 items-center">
            <span
              v-if="loadingNotifications"
              class="text-xs text-muted-foreground"
              >更新中…</span
            >
          </div>
        </CardHeader>
        <CardContent class="pt-0 flex-1 min-h-0 flex flex-col">
          <div v-if="errorNotifications" class="text-sm text-red-500 py-2">
            {{ errorNotifications }}
          </div>
          <div v-else class="flex-1 min-h-0">
            <ul class="space-y-2 overflow-y-auto pr-1 h-full">
              <li
                v-if="!loadingNotifications && !news.length"
                class="text-sm text-muted-foreground py-1"
              >
                新着情報はありません。
              </li>
              <li
                v-for="n in news"
                :key="n.id"
                class="group rounded border px-3 py-2 bg-background/60 hover:bg-background/80 transition relative"
                :class="
                  n.isRead ? 'border-border/50' : 'border-primary/40 shadow-sm'
                "
              >
                <div class="flex items-start justify-between gap-3">
                  <span
                    :class="[
                      'text-[13px] leading-4',
                      n.isRead ? 'opacity-60' : 'font-medium',
                    ]"
                    >{{ n.title }}</span
                  >
                  <span
                    class="text-muted-foreground text-[11px] whitespace-nowrap leading-4"
                    >{{ formatDateTime(n.createdAt) }}</span
                  >
                </div>
                <p
                  class="text-[11px] leading-snug text-muted-foreground mt-1 whitespace-pre-line"
                >
                  {{ n.message }}
                </p>
                <span
                  v-if="!n.isRead"
                  class="absolute -left-1.5 top-2 h-2 w-2 rounded-full bg-primary animate-pulse"
                ></span>
              </li>
              <li v-if="loadingNotifications" class="space-y-2">
                <div class="h-10 rounded bg-muted/60 animate-pulse"></div>
                <div class="h-10 rounded bg-muted/60 animate-pulse"></div>
                <div class="h-10 rounded bg-muted/60 animate-pulse"></div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Divider -->
    <Separator />

    <div class="flex flex-col gap-14">
      <!-- Won Items -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="font-semibold flex items-center gap-2">
            落札商品
            <span
              v-if="wonItems.length"
              class="text-xs text-muted-foreground font-normal"
              >{{ wonItems.length }}件</span
            >
          </h2>
          <div class="flex items-center gap-2">
            <router-link
              :to="{ name: 'mypage-won' }"
              class="text-xs text-primary hover:underline"
              >もっと見る</router-link
            >
          </div>
        </div>
        <div class="relative">
          <div
            v-if="loadingWon"
            class="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg z-10"
          >
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                class="w-3 h-3 rounded-full bg-primary/40 animate-ping"
              ></span
              >読み込み中…
            </div>
          </div>
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            <div
              v-for="w in wonItems"
              :key="w.id"
              class="group relative rounded-lg border bg-card/70 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition flex flex-col"
            >
              <router-link
                :to="`/auction/${w.id}`"
                class="block overflow-hidden"
              >
                <img
                  :src="w.thumbnailImageUrl"
                  :alt="w.name"
                  class="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </router-link>
              <div class="p-2 flex flex-col gap-1 flex-1">
                <h3
                  class="text-[12px] font-medium leading-tight line-clamp-2 min-h-[2.0rem]"
                >
                  <router-link
                    :to="`/auction/${w.id}`"
                    class="hover:underline"
                    >{{ w.name }}</router-link
                  >
                </h3>
                <div
                  class="mt-auto flex items-center justify-between text-[11px]"
                >
                  <span class="font-semibold text-primary tabular-nums"
                    >¥{{ w.currentPrice.toLocaleString() }}</span
                  >
                  <span
                    class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    >獲得</span
                  >
                </div>
              </div>
              <div
                class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 via-transparent to-fuchsia-400/10"
              ></div>
            </div>
            <div
              v-if="!loadingWon && !wonItems.length && !itemsError"
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
      </div>

      <!-- Bidding Items -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="font-semibold">入札中</h2>
          <router-link
            :to="{ name: 'mypage-bidding' }"
            class="text-xs text-primary hover:underline"
            >もっと見る</router-link
          >
        </div>
        <div class="rounded-lg p-3">
          <AuctionItemRealtimeGrid
            :fetch-fn="fetchBiddingItems"
            :empty-message="'現在入札中の商品はありません。'"
          />
        </div>
      </div>
    </div>
  </section>
</template>
