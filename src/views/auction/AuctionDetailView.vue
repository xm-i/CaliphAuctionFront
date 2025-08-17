<script setup lang="ts">
import { AuctionItem } from "@/types/auction-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { numberWithComma } from "@/lib/utils";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

import thumbnailSample from "@/assets/thumbnail-sample.png";
import imageSample from "@/assets/image-sample.png";

const route = useRoute();
const itemId = Number(route.params.id);

const item = ref<AuctionItem | null>(null);

// カウントダウン
const remainingTime = ref("");
let timer: number | undefined;

function updateCountdown(endTime: Date) {
  const diff = new Date(endTime).getTime() - Date.now();

  if (diff <= 0) {
    remainingTime.value = "終了";
    clearInterval(timer);
    return;
  }

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  remainingTime.value = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

onMounted(() => {
  item.value = {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    currentBid: 100,
    thumbnailImageUrl: thumbnailSample,
    imageUrl: imageSample,
    startingBid: 100,
    currentBidUserId: "user1",
    currentBidUserName: "User One",
    endTime: new Date(Date.now() + 3600 * 1000),
    status: "active",
    bidHistory: [
      {
        id: 1,
        userId: "user1",
        userName: "User One",
        bidAmount: 100,
        bidTime: new Date(),
      },
      {
        id: 2,
        userId: "user2",
        userName: "User Two",
        bidAmount: 150,
        bidTime: new Date(),
      },
    ],
  };
  if (item.value) {
    timer = window.setInterval(
      () => updateCountdown(item.value!.endTime),
      1000
    );
    updateCountdown(item.value.endTime);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
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
          残り時間: {{ remainingTime }}
        </div>

        <div class="text-center space-y-2">
          <p class="text-2xl font-bold">
            ¥{{ numberWithComma(item.currentBid) }}
          </p>
          <p class="text-muted-foreground">
            {{ item.currentBidUserName }}
          </p>
        </div>
        <p class="text-muted-foreground whitespace-pre-line leading-relaxed">
          {{ item.description }}
        </p>

        <div class="flex justify-center pt-4">
          <Button size="lg">入札</Button>
        </div>
      </div>
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">入札履歴</h2>
        <Separator class="mb-4" />
        <ul class="space-y-2">
          <li v-for="bid in item.bidHistory" :key="bid.id">
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
