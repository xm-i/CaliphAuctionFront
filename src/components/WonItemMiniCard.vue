<script setup lang="ts">
import type { SearchItemDto } from "@/api/auction";
import { computed, ref } from "vue";

const props = defineProps<{ item: SearchItemDto }>();
const imgLoaded = ref(false);

const price = computed(() => props.item.currentPrice.toLocaleString());
</script>

<template>
  <div
    class="group relative rounded-lg border bg-card/70 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition flex flex-col"
  >
    <router-link :to="`/auction/${item.id}`" class="block overflow-hidden">
      <img
        :src="item.thumbnailImageUrl"
        :alt="item.name"
        class="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
        loading="lazy"
        @load="imgLoaded = true"
      />
    </router-link>
    <div class="p-2 flex flex-col gap-1 flex-1">
      <h3
        class="text-[12px] font-medium leading-tight line-clamp-2 min-h-[2.0rem]"
      >
        <router-link :to="`/auction/${item.id}`" class="hover:underline">{{
          item.name
        }}</router-link>
      </h3>
      <div class="mt-auto flex items-center justify-between text-[11px]">
        <span class="font-semibold text-primary tabular-nums"
          >¥{{ price }}</span
        >
        <span
          v-if="(item as any).purchased"
          class="px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
          >購入済</span
        >
        <span
          v-else
          class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          >獲得</span
        >
      </div>
    </div>
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 via-transparent to-fuchsia-400/10"
    ></div>
  </div>
</template>
