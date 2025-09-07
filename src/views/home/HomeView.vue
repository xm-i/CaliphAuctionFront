<script lang="ts" setup>
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import HeroSection from "@/components/home/HeroSection.vue";
</script>

<template>
  <div class="home flex flex-col gap-12">
    <HeroSection />
    <section class="container lg:w-[90%] space-y-4 pb-16">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        開催中のオークション
      </h2>
      <AuctionItemRealtimeGrid
        empty-message="現在出品されている商品はありません"
      />
    </section>
  </div>
</template>
