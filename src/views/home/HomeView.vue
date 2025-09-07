<script lang="ts" setup>
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
</script>

<template>
  <div class="home">
    <section class="container lg:w-[90%] space-y-4">
      <AuctionItemRealtimeGrid
        empty-message="現在出品されている商品はありません"
      />
    </section>
  </div>
</template>
