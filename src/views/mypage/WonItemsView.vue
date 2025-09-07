<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getWonItems } from "@/api/me";
import type { SearchItemDto } from "@/api/auction";
import AuctionItemCard from "@/components/AuctionItemCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const items = ref<SearchItemDto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadAll() {
  loading.value = true;
  error.value = null;
  try {
    const res = await getWonItems();
    items.value = res.items;
  } catch (e) {
    error.value = "取得に失敗しました";
  } finally {
    loading.value = false;
  }
}

onMounted(loadAll);

function goBack() {
  router.push({ name: "mypage" });
}
</script>

<template>
  <section class="container lg:w-[90%] py-8 space-y-8">
    <header class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">落札商品一覧</h1>
        <button
          class="text-sm text-primary hover:underline underline-offset-2"
          @click="goBack"
        >
          &larr; マイページへ戻る
        </button>
      </div>
      <p class="text-sm text-muted-foreground">
        過去に落札した商品です。履歴は最新順で表示します。
      </p>
    </header>

    <div v-if="loading" class="text-center text-muted-foreground py-6 text-sm">
      読み込み中...
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-6 text-sm">
      {{ error }}
    </div>
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      <AuctionItemCard v-for="it in items" :key="it.id" :item="it" />
      <div
        v-if="!items.length"
        class="col-span-full text-sm text-muted-foreground text-center py-8"
      >
        落札商品はありません。
      </div>
    </div>
  </section>
</template>
