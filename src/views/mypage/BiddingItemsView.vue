<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { getBiddingItems } from "@/api/me";
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const initialLoaded = ref(false);

// すべて取得 (limit なし)。API が大量件数になる場合は後でページング実装。
async function fetchAllBidding() {
  const res = await getBiddingItems();
  initialLoaded.value = true;
  return res;
}

function goBack() {
  router.push({ name: "mypage" });
}
</script>

<template>
  <section class="container lg:w-[90%] py-8 space-y-8">
    <header class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">入札中一覧</h1>
        <Button
          variant="link"
          class="text-sm px-0 h-auto font-normal underline-offset-2 hover:underline"
          @click="goBack"
          >&larr; マイページへ戻る</Button
        >
      </div>
      <p class="text-sm text-muted-foreground">
        リアルタイムで更新されます。ブラウザを閉じると購読は解除されます。
      </p>
    </header>

    <AuctionItemRealtimeGrid
      :fetch-fn="fetchAllBidding"
      :empty-message="'現在入札中の商品はありません。'"
      :grid-class="'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6'"
    />

    <div
      v-if="!initialLoaded"
      class="text-center text-xs text-muted-foreground"
    >
      初回読み込み中...
    </div>
  </section>
</template>
