<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// プレースホルダーの疑似データ
const news = ref<Array<{ id: number; title: string; date: string }>>([
  { id: 1, title: "落札おめでとうございます", date: "2025-08-31" },
  { id: 2, title: "ポイントチャージが完了しました", date: "2025-08-30" },
]);

const totalSpent = ref<number>(0);
const points = ref<number>(0);

const wonItems = ref<Array<{ id: number; name: string; price: number }>>([
  { id: 10, name: "サンプル落札1", price: 1234 },
  { id: 11, name: "サンプル落札2", price: 5678 },
]);
const biddingItems = ref<Array<{ id: number; name: string; current: number }>>([
  { id: 20, name: "入札中1", current: 111 },
  { id: 21, name: "入札中2", current: 222 },
]);
</script>

<template>
  <section class="container lg:w-[90%] space-y-6 py-6">
    <h1 class="text-3xl font-bold">マイページ</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 所持ポイント / 利用金額合計 -->
      <div class="col-span-1 space-y-4">
        <div class="rounded-lg border p-4 bg-card">
          <h2 class="font-semibold mb-2">所持ポイント</h2>
          <p class="text-2xl">{{ points.toLocaleString() }} pt</p>
          <div class="mt-3">
            <Button as-child>
              <router-link :to="{ name: 'mypage-charge' }"
                >ポイント購入へ</router-link
              >
            </Button>
          </div>
        </div>
        <div class="rounded-lg border p-4 bg-card">
          <h2 class="font-semibold mb-2">利用金額合計</h2>
          <p class="text-2xl">¥{{ totalSpent.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 新着情報 -->
      <div class="col-span-2 rounded-lg border p-4 bg-card">
        <h2 class="font-semibold mb-3">新着情報</h2>
        <ul class="space-y-2">
          <li v-for="n in news" :key="n.id" class="flex justify-between">
            <span>{{ n.title }}</span>
            <span class="text-muted-foreground text-sm">{{ n.date }}</span>
          </li>
        </ul>
      </div>
    </div>

    <Separator />

    <!-- 落札商品（5件） -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">落札商品</h2>
        <router-link :to="{ name: 'mypage-won' }" class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="w in wonItems.slice(0, 5)"
          :key="w.id"
          class="rounded-md border p-3 bg-card"
        >
          <p class="font-medium line-clamp-1">{{ w.name }}</p>
          <p class="text-sm text-muted-foreground">
            ¥{{ w.price.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- 入札中（5件） -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="font-semibold">入札中</h2>
        <router-link
          :to="{ name: 'mypage-bidding' }"
          class="text-sm text-primary"
          >もっと見る</router-link
        >
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="b in biddingItems.slice(0, 5)"
          :key="b.id"
          class="rounded-md border p-3 bg-card"
        >
          <p class="font-medium line-clamp-1">{{ b.name }}</p>
          <p class="text-sm text-muted-foreground">
            現在 ¥{{ b.current.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
