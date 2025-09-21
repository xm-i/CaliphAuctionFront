<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { numberWithComma } from "@/utils";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { toCdnUrl } from "@/lib/cdn"; // Ensures all item images are served from the CDN origin
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import {
  AuctionStatus,
  getAuctionItem,
  type AuctionDetailDto,
} from "@/api/auction";
import CountdownTimer from "@/components/CountdownTimer.vue";
import PlaceBidButton from "@/components/PlaceBidButton.vue";
import { Button } from "@/components/ui/button";
import { auctionHub, type BidUpdateDto } from "@/realtime/auctionHub";
import { usePageTitle } from "@/composables/usePageTitle";
import { useHeader } from "@/composables/useHeader";

const route = useRoute();
const itemId = Number(route.params.id);

const item = ref<AuctionDetailDto | null>(null);
// dynamic page title
const { setTitle } = usePageTitle();
watch(item, (val) => {
  if (val) {
    setTitle(val.name);
  }
});

useHeader(() => {
  if (!item.value) return {};
  const desc = (item.value.description || "")
    .replace(/\s+/g, " ")
    .slice(0, 120)
    .trim();
  return {
    title: item.value.name,
    description: desc,
    image:
      typeof item.value.imageUrl === "string"
        ? toCdnUrl(item.value.imageUrl)
        : undefined,
    url: `${window.location.origin}/auction/${item.value.id}`,
  };
});
const errorMessage = ref<string | null>(null);
const refreshing = ref(false);
const loading = ref(true);
const priceChange = ref<null | "up">(null);

// auth current user
const { user } = useAuth();
const isSelfHighest = computed(() => {
  if (!item.value || !user.value) return false;
  return item.value.currentHighestBidUserId === user.value.id;
});

const savingsAmount = computed(() => {
  if (!item.value) return 0;
  return Math.max(0, item.value.originalPrice - item.value.currentPrice);
});
const savingsPercent = computed(() => {
  if (!item.value || item.value.originalPrice <= 0) return 0;
  return Math.floor((savingsAmount.value / item.value.originalPrice) * 100);
});
const formattedEndTime = computed(() => {
  if (!item.value) return "";
  return new Date(item.value.endTime).toLocaleString("ja-JP", {
    hour12: false,
  });
});

const descriptionDisplay = computed(() => {
  const raw = item.value?.description ?? "";
  const text = raw.replace(/\\n/gi, "\n");
  return text;
});

const statusBadge = computed(() => {
  if (!item.value) return null;
  switch (item.value.status) {
    case AuctionStatus.Preparing:
      return { text: "準備中", cls: "bg-muted text-muted-foreground" };
    case AuctionStatus.Active:
      return {
        text: "開催中",
        cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      };
    case AuctionStatus.Ended:
      return { text: "終了", cls: "bg-muted text-muted-foreground" };
    default:
      return null;
  }
});

onMounted(async () => {
  try {
    const data = await getAuctionItem(itemId);
    item.value = data;
  } finally {
    loading.value = false;
  }
  await auctionHub.subscribeItem(itemId);
  unbindUpdate = auctionHub.onBidUpdate((u: BidUpdateDto) => {
    if (!item.value || u.auctionItemId !== itemId) return;
    const oldPrice = item.value.currentPrice;
    item.value.currentPrice = u.currentPrice;
    if (u.currentPrice > oldPrice) {
      priceChange.value = "up";
      window.setTimeout(() => (priceChange.value = null), 2000);
    }
    item.value.endTime = new Date(u.endTime);
    item.value.currentHighestBidUserId = u.currentHighestBidUserId;
    item.value.currentHighestBidUserName = u.currentHighestBidUserName;
    item.value.bidCount++;
    item.value.bidHistories.unshift({
      id: u.bidId,
      username: u.currentHighestBidUserName,
      bidAmount: u.currentPrice,
      bidTime: new Date(u.bidTime),
    });
  });
  unbindClosed = auctionHub.onAuctionClosed(async () => {
    if (item.value?.status === AuctionStatus.Ended) return;
    await onTimerFinished();
  });
});

let unbindUpdate: (() => void) | null = null;
let unbindClosed: (() => void) | null = null;
onUnmounted(async () => {
  if (unbindUpdate) {
    unbindUpdate();
  }
  if (unbindClosed) {
    unbindClosed();
  }
  await auctionHub.unsubscribeItem(itemId);
});

async function refreshDetail() {
  if (!item.value) return;
  try {
    const fresh = await getAuctionItem(item.value.id);
    item.value = fresh;
  } catch (e: any) {
    errorMessage.value = "入札後の情報取得に失敗しました";
  }
}

async function onTimerFinished() {
  if (!item.value || refreshing.value) return;
  refreshing.value = true;
  errorMessage.value = null;
  try {
    const fresh = await getAuctionItem(item.value.id);
    item.value = fresh;
  } catch (e: any) {
    errorMessage.value = "終了時の情報取得に失敗しました";
  } finally {
    refreshing.value = false;
  }
}

function formatBidTime(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString("ja-JP", { hour12: false });
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-6">
      <div class="h-8 w-2/3 bg-muted/40 rounded animate-pulse" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
        <div
          class="sm:row-span-2 lg:col-span-3 aspect-square rounded-lg bg-muted/40 animate-pulse"
        />
        <div class="lg:col-span-2 space-y-4">
          <div class="h-6 w-32 bg-muted/40 rounded animate-pulse" />
          <div class="h-10 w-40 bg-muted/30 rounded animate-pulse" />
          <div class="h-24 w-full bg-muted/30 rounded animate-pulse" />
        </div>
        <div class="lg:col-span-2 space-y-3">
          <div class="h-6 w-28 bg-muted/40 rounded animate-pulse" />
          <div class="space-y-2">
            <div class="h-5 w-full bg-muted/30 rounded animate-pulse" />
            <div class="h-5 w-5/6 bg-muted/30 rounded animate-pulse" />
            <div class="h-5 w-2/3 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="item">
      <div class="flex flex-col gap-4">
        <div
          v-if="item.status === AuctionStatus.Ended"
          class="rounded-lg border border-amber-500/40 bg-amber-100/40 dark:bg-amber-400/10 p-3 flex items-center justify-between gap-4 text-amber-800 dark:text-amber-200 text-sm"
        >
          <span>
            このオークションは終了しました。
            <template v-if="isSelfHighest"
              >あなたが最高入札者です。購入手続きに進んでください。</template
            >
          </span>
          <Button
            v-if="isSelfHighest"
            size="sm"
            class="text-xs px-3 py-1.5 font-medium hover:opacity-90 soft-transition"
            @click="
              $router.push({
                name: 'auction-purchase',
                params: { id: item.id },
              })
            "
          >
            購入手続きへ
          </Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
            {{ item.name }}
          </h1>
          <span
            v-if="statusBadge"
            class="px-3 py-1 rounded-full text-xs font-medium shadow-sm select-none"
            :class="statusBadge.cls"
            >{{ statusBadge.text }}</span
          >
          <span
            class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px]"
            >カテゴリ: {{ item.categoryName }}</span
          >
          <span
            class="px-2 py-0.5 rounded-md bg-secondary/50 text-[11px] text-foreground/70"
            >入札数: {{ item.bidCount }}</span
          >
        </div>
        <div
          class="text-sm leading-relaxed whitespace-pre-line text-muted-foreground/90"
        >
          {{ descriptionDisplay }}
        </div>
        <Separator class="mt-2" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
        <!-- Image -->
        <div
          class="sm:row-span-2 lg:col-span-3 group relative rounded-lg overflow-hidden ring-1 ring-border/60 bg-card/60 backdrop-blur"
        >
          <AspectRatio :ratio="1" class="overflow-hidden">
            <img
              :src="toCdnUrl(item.imageUrl)"
              :alt="item.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </AspectRatio>
          <div
            class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
          />
        </div>

        <!-- Info / Bid Panel -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div class="flex flex-col items-center gap-3">
            <div class="mt-1 text-2xl text-muted-foreground">
              <CountdownTimer
                :end-time="item.endTime"
                @finished="onTimerFinished"
                v-slot="{ text, urgent }"
              >
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-2xl font-semibold tracking-tight',
                    urgent
                      ? 'bg-destructive/15 text-destructive animate-[pulse_1s_ease-in-out_infinite]'
                      : 'bg-secondary/50 text-foreground/80',
                  ]"
                >
                  <span
                    class="w-2.5 h-2.5 rounded-full"
                    :class="
                      urgent
                        ? 'bg-destructive animate-ping-slow'
                        : 'bg-primary/50'
                    "
                  ></span>
                  {{ text }}
                </span>
              </CountdownTimer>
            </div>
            <div
              class="text-4xl font-bold tracking-tight tabular-nums relative"
              :class="priceChange === 'up' ? 'price-up' : ''"
              aria-live="polite"
            >
              ¥{{ numberWithComma(item.currentPrice) }}
              <span
                v-if="priceChange === 'up'"
                class="ml-2 text-emerald-500 text-base font-semibold align-middle"
                >▲</span
              >
            </div>
            <div
              v-if="savingsPercent > 0"
              class="flex items-center gap-2 -mt-1"
            >
              <span class="line-through text-[11px] text-muted-foreground/60"
                >¥{{ numberWithComma(item.originalPrice) }}</span
              >
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/70"></span>
                {{ savingsPercent }}%OFF
                <span class="text-foreground/60"
                  >(¥{{ numberWithComma(savingsAmount) }} お得)</span
                >
              </span>
            </div>
            <div
              class="text-sm min-h-[1.25rem] px-2 py-1 rounded transition"
              :class="
                isSelfHighest
                  ? 'bg-primary/15 text-primary font-medium ring-1 ring-primary/40'
                  : 'text-muted-foreground'
              "
            >
              {{ item.currentHighestBidUserName || "—" }}
              <span v-if="isSelfHighest" class="ml-1 text-[10px] tracking-wide"
                >(あなた)</span
              >
            </div>

            <div class="flex flex-col items-center gap-2 w-full">
              <PlaceBidButton
                :auction-item-id="item.id"
                :current-price="item.currentPrice"
                :bid-increment="item.bidIncrement"
                :bid-point-cost="item.bidPointCost"
                :highest-bid-user-id="item.currentHighestBidUserId"
                :loading="refreshing"
                :status="item.status"
                @placed="refreshDetail"
                @error="(m:string)=> (errorMessage = m)"
                @onBeaforeClick="errorMessage = null"
                @onError="refreshDetail"
              />
              <p v-if="errorMessage" class="text-destructive text-xs">
                {{ errorMessage }}
              </p>
            </div>
            <!-- Extra meta info -->
            <ul
              class="w-full text-xs text-muted-foreground/70 grid grid-cols-2 gap-y-1 px-2 leading-relaxed"
            >
              <li>
                <span class="text-foreground/50">開始:</span>
                ¥{{ numberWithComma(item.startingBid) }}
              </li>
              <li>
                <span class="text-foreground/50">元値:</span>
                ¥{{ numberWithComma(item.originalPrice) }}
              </li>
              <li>
                <span class="text-foreground/50">単位:</span>
                ¥{{ numberWithComma(item.bidIncrement) }}
              </li>
              <li>
                <span class="text-foreground/50">消費P:</span>
                {{ numberWithComma(item.bidPointCost) }}
              </li>
              <li class="col-span-2">
                <span class="text-foreground/50"
                  >終了{{
                    item.status === AuctionStatus.Ended ? "" : "予定"
                  }}:</span
                >
                {{ formattedEndTime }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Bid History -->
        <div
          class="lg:col-span-2 flex flex-col rounded-lg border bg-card/50 backdrop-blur-sm p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold">入札履歴</h2>
          </div>
          <ul
            class="space-y-2 overflow-y-auto max-h-80 pr-1 custom-scrollbar"
            v-auto-animate
          >
            <li
              v-for="bid in item.bidHistories"
              :key="bid.id"
              class="flex items-center justify-between text-sm rounded-md bg-background/40 border border-border/50 px-3 py-2 hover:bg-background/70 transition"
            >
              <div class="flex flex-col">
                <span class="font-medium leading-tight">{{
                  bid.username
                }}</span>
                <span class="text-[11px] text-muted-foreground">{{
                  formatBidTime(bid.bidTime)
                }}</span>
              </div>
              <div class="text-right font-semibold tabular-nums">
                ¥{{ numberWithComma(bid.bidAmount) }}
              </div>
            </li>
            <li
              v-if="!item.bidHistories.length"
              class="text-muted-foreground text-sm"
            >
              まだ入札はありません。
            </li>
          </ul>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-20 text-muted-foreground">
      商品が見つかりませんでした。
    </div>
  </div>
</template>

<style scoped>
@keyframes priceFlashUpDetail {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
  30% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.25);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
.price-up {
  animation: priceFlashUpDetail 0.9s ease;
}
</style>
