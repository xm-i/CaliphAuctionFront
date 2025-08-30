<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { numberWithComma } from "@/lib/utils";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getAuctionItem, type AuctionDetailDto } from "@/api/auction";
import CountdownTimer from "@/components/CountdownTimer.vue";
import PlaceBidButton from "@/components/PlaceBidButton.vue";
import { auctionHub, type BidUpdateDto } from "@/realtime/auctionHub";

const route = useRoute();
const itemId = Number(route.params.id);

const item = ref<AuctionDetailDto | null>(null);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  const data = await getAuctionItem(itemId);
  item.value = data;
  await auctionHub.subscribeItem(itemId);
  stopUpdate = auctionHub.onBidUpdate((u: BidUpdateDto) => {
    if (!item.value) {
      return;
    }
    if (u.auctionItemId !== itemId) {
      return;
    }

    item.value.currentPrice = u.currentPrice;
    item.value.endTime = new Date(u.endTime);
    item.value.currentHighestBidUserId = u.currentHighestBidUserId;
    item.value.currentHighestBidUserName = u.currentHighestBidUserName;
    item.value.bidCount++;

    item.value.bidHistories.push({
      id: u.bidId,
      userName: u.currentHighestBidUserName,
      bidAmount: u.currentPrice,
      bidTime: new Date(u.bidTime),
    });
  });
});

let stopUpdate: (() => void) | null = null;
onUnmounted(async () => {
  if (stopUpdate) {
    stopUpdate();
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
</script>

<template>
  <div v-if="item" class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-3xl font-bold tracking-tight">{{ item.name }}</h1>
    <Separator></Separator>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
      <div class="sm:row-span-2 lg:col-span-3">
        <AspectRatio :ratio="1" class="overflow-hidden rounded-lg">
          <img
            :src="item.imageUrl"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>
      <div class="lg:col-span-2">
        <div class="text-lg font-semibold text-center text-red-600">
          <CountdownTimer v-if="item" :end-time="item.endTime" />
        </div>
        <div class="text-center space-y-2">
          <p class="text-2xl font-bold">
            ¥{{ numberWithComma(item.currentPrice) }}
          </p>
          <p class="text-muted-foreground">
            {{ item.currentHighestBidUserName }}
          </p>
        </div>
        <p class="text-muted-foreground whitespace-pre-line leading-relaxed">
          {{ item.description }}
        </p>

        <div class="flex flex-col items-center gap-3 pt-4">
          <PlaceBidButton
            v-if="item"
            :auction-item-id="item.id"
            :current-price="item.currentPrice"
            :highest-bid-user-id="item.currentHighestBidUserId"
            @placed="refreshDetail"
            @error="(m:string)=> (errorMessage = m)"
          />
          <p v-if="errorMessage" class="text-red-600 text-sm">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">入札履歴</h2>
        <Separator class="mb-4" />
        <ul class="space-y-2">
          <li v-for="bid in item.bidHistories" :key="bid.id">
            <div class="flex justify-between">
              <span>{{ bid.userName }}</span>
              <span>¥{{ numberWithComma(bid.bidAmount) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
