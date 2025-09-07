<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const router = useRouter();
const store = usePointsPurchaseStore();
const plan = computed(() => store.selectedPlan);

if (!plan.value) {
  router.replace({ name: "mypage-charge" });
}

function back() {
  router.replace({ name: "mypage-charge" });
}

function choose(method: string) {
  switch (method) {
    case "paypal":
      router.push({ name: "points-paypal-login" });
      break;
    case "card":
      router.push({ name: "points-credit-card" });
      break;
    case "bank":
      router.push({ name: "points-bank-transfer" });
      break;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-background"
  >
    <header
      class="px-5 py-3 border-b bg-background/80 backdrop-blur flex items-center justify-between"
    >
      <h1 class="font-semibold tracking-tight">支払い方法の選択</h1>
      <Button size="sm" variant="ghost" @click="back">戻る</Button>
    </header>
    <main class="flex-1 px-5 py-6">
      <div class="mx-auto max-w-md space-y-6">
        <Card v-if="plan" class="border-primary/40">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">選択中のプラン</span>
              <span class="text-lg font-bold">{{ plan.name }}</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0 text-sm space-y-1">
            <p>
              ポイント: <strong>{{ plan.points.toLocaleString() }}</strong> pt
            </p>
            <p>
              価格: <strong>\{{ plan.price.toLocaleString() }}</strong>
            </p>
          </CardContent>
        </Card>

        <div class="grid gap-4">
          <Card
            class="cursor-pointer hover:shadow-md transition"
            @click="choose('paypal')"
          >
            <CardHeader class="pb-1">
              <CardTitle class="text-base">PayPal で支払う</CardTitle>
            </CardHeader>
            <CardContent class="pt-0 text-xs text-muted-foreground"
              >PayPal ログイン画面に遷移します。</CardContent
            >
          </Card>
          <Card
            class="cursor-pointer hover:shadow-md transition"
            @click="choose('card')"
          >
            <CardHeader class="pb-1">
              <CardTitle class="text-base">クレジットカードで支払う</CardTitle>
            </CardHeader>
            <CardContent class="pt-0 text-xs text-muted-foreground"
              >カード情報を入力して即時決済します。</CardContent
            >
          </Card>
          <Card
            class="cursor-pointer hover:shadow-md transition"
            @click="choose('bank')"
          >
            <CardHeader class="pb-1">
              <CardTitle class="text-base">銀行振込で支払う</CardTitle>
            </CardHeader>
            <CardContent class="pt-0 text-xs text-muted-foreground"
              >振込口座情報を入力して処理を行います。</CardContent
            >
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
