<script setup lang="ts">
import type { SearchItemDto } from "@/api/auction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { numberWithComma } from "@/lib/utils";
import PlaceBidButton from "@/components/PlaceBidButton.vue";
import CountdownTimer from "@/components/CountdownTimer.vue";
import { ref, watch } from "vue";

const props = defineProps<{
  item: SearchItemDto;
}>();

const refreshing = ref(false);
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
</script>

<template>
  <Card
    class="relative flex flex-col h-full overflow-hidden group bg-card/70 backdrop-blur-sm border-border/60 hover-raise soft-transition"
  >
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
    ></div>
    <CardHeader class="p-0 pb-3 gap-0">
      <div class="relative overflow-hidden rounded-md mb-2">
        <router-link :to="`/auction/${item.id}`" class="block">
          <img
            :src="item.thumbnailImageUrl"
            :alt="item.name"
            class="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </router-link>
        <div
          class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-background/70 backdrop-blur border border-border/60"
        >
          #{{ item.id }}
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
        <div class="text-xl font-bold tracking-tight text-gradient-primary">
          \{{ numberWithComma(item.currentPrice) }}
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
        :highest-bid-user-id="props.item.currentHighestBidUserId"
        :loading="refreshing"
        :status="props.item.status"
      />
    </CardContent>
    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      :class="(item as any).endTime && new Date(item.endTime).getTime() - Date.now() <= 10_000 ? 'opacity-100 animate-[flash_1s_steps(2)_infinite] bg-red-500/8' : ''"
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
</style>
