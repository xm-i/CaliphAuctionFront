<script setup lang="ts">
import type { SearchItemDto } from "@/api/auction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { numberWithComma } from "@/lib/utils";
import PlaceBidButton from "@/components/PlaceBidButton.vue";
import CountdownTimer from "@/components/CountdownTimer.vue";
import { ref, watch, computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import { AuctionStatus } from "@/api/auction";

const props = defineProps<{
  item: SearchItemDto;
}>();

const refreshing = ref(false);
const imgLoaded = ref(false);
const priceChange = ref<null | "up">(null);
const { user } = useAuth();

const isHighest = computed(
  () =>
    !!user?.value &&
    props.item.currentHighestBidUserId &&
    user.value.id === props.item.currentHighestBidUserId
);

const isEnded = computed(() => props.item.status === AuctionStatus.Ended);

const bidIncrementText = computed(() =>
  props.item.bidIncrement ? `+${props.item.bidIncrement}` : null
);
const emit = defineEmits<{ (e: "refresh", id: number): void }>();

function onFinished() {
  refreshing.value = true;
  emit("refresh", props.item.id);
}

watch(
  () => [props.item.endTime],
  () => {
    refreshing.value = false;
  }
);

watch(
  () => props.item.currentPrice,
  (newVal, oldVal) => {
    if (oldVal != null && newVal > oldVal) {
      priceChange.value = "up";
      window.setTimeout(() => (priceChange.value = null), 2000);
    }
  }
);
</script>

<template>
  <Card
    class="relative flex flex-col h-full overflow-hidden group bg-card/70 backdrop-blur-sm border-border/60 hover-raise soft-transition"
    :class="[
      isHighest && !isEnded ? 'ring-1 ring-primary/50 shadow-primary/20' : '',
      isEnded ? 'opacity-90 grayscale-[25%]' : '',
    ]"
  >
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
    ></div>
    <CardHeader class="p-0 pb-3 gap-0">
      <div class="relative overflow-hidden rounded-md mb-2">
        <!-- Image Wrapper with skeleton -->
        <div class="relative block">
          <router-link :to="`/auction/${item.id}`" class="block">
            <img
              :src="item.thumbnailImageUrl"
              :alt="item.name + ' のサムネイル'"
              class="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              @load="imgLoaded = true"
            />
          </router-link>
          <div
            v-if="!imgLoaded"
            class="absolute inset-0 flex items-center justify-center bg-muted/40 animate-pulse"
          >
            <span class="text-[10px] text-muted-foreground">Loading…</span>
          </div>
        </div>
        <!-- Top Left ID badge -->
        <div
          class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-background/70 backdrop-blur border border-border/60 shadow-sm"
        >
          #{{ item.id }}
        </div>
        <!-- Top Right status/labels -->
        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span
            v-if="isHighest && !isEnded"
            class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary shadow-sm"
            >最高入札者</span
          >
          <span
            v-if="isEnded"
            class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/80 text-muted-foreground"
            >終了</span
          >
        </div>
      </div>
      <CardTitle
        class="px-1 text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]"
      >
        <router-link
          :to="`/auction/${item.id}`"
          class="hover:underline underline-offset-2"
        >
          {{ item.name }}
        </router-link>
      </CardTitle>
    </CardHeader>

    <CardContent class="pt-0 pb-1 text-center">
      <div class="flex flex-col items-center gap-1">
        <div
          class="text-xl font-bold tracking-tight text-gradient-primary flex items-baseline gap-1 relative"
          :class="[priceChange === 'up' ? 'price-up' : '']"
        >
          <span class="text-[11px] font-medium text-muted-foreground">¥</span>
          <span class="inline-flex items-baseline">
            {{ numberWithComma(item.currentPrice) }}
            <span
              v-if="priceChange === 'up'"
              class="ml-1 text-[10px] text-emerald-500 font-semibold translate-y-0.5"
              >▲</span
            >
          </span>
          <span
            v-if="bidIncrementText"
            class="ml-1 text-[10px] font-normal text-muted-foreground/70"
            >({{ bidIncrementText }})</span
          >
        </div>
        <div
          v-if="item.currentHighestBidUserName"
          class="text-[11px] text-muted-foreground/80"
        >
          {{ item.currentHighestBidUserName }} さん
        </div>
        <div class="mt-1 text-2xl text-muted-foreground">
          <CountdownTimer
            :end-time="item.endTime"
            @finished="onFinished"
            v-slot="{ text, urgent }"
          >
            <span
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors',
                urgent
                  ? 'bg-destructive/15 text-destructive font-semibold animate-[pulse_1s_ease-in-out_infinite]'
                  : 'bg-secondary/50 text-foreground/70',
              ]"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="
                  urgent ? 'bg-destructive animate-ping-slow' : 'bg-primary/40'
                "
              ></span>
              {{ text }}
            </span>
          </CountdownTimer>
        </div>
      </div>
    </CardContent>

    <CardContent class="pt-1 pb-3 flex justify-center mt-auto">
      <PlaceBidButton
        :auction-item-id="props.item.id"
        :current-price="props.item.currentPrice"
        :bid-increment="props.item.bidIncrement"
        :bid-point-cost="props.item.bidPointCost"
        :highest-bid-user-id="props.item.currentHighestBidUserId"
        :loading="refreshing"
        :status="props.item.status"
      />
    </CardContent>
    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      :class="(item as any).endTime && new Date(item.endTime).getTime() - Date.now() <= 10_000 ? 'opacity-100 animate-[flash_1s_steps(2)_infinite] bg-red-500/8' : ''"
    ></div>
    <div
      v-if="isHighest && !isEnded"
      class="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/25"
    ></div>
  </Card>
</template>

<style scoped>
@keyframes flash {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 0;
  }
}
@keyframes ping-slow {
  0% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.25);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.9;
  }
}
.animate-ping-slow {
  animation: ping-slow 1.4s ease-in-out infinite;
}
@keyframes priceFlashUp {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
  30% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.25);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
.price-up {
  animation: priceFlashUp 0.85s ease;
}
</style>
