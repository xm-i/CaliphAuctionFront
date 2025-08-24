<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { numberWithComma } from "@/lib/utils";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getAuctionItem, type AuctionDetailDto } from "@/api/auction";

const route = useRoute();
const itemId = Number(route.params.id);

const item = ref<AuctionDetailDto | null>(null);

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

onMounted(async () => {
  const data = await getAuctionItem(itemId);
  item.value = data;
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
            ¥{{ numberWithComma(item.currentPrice) }}
          </p>
          <p class="text-muted-foreground">
            {{ item.currentHighestBidUserName }}
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
