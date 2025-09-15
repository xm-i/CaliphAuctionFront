<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, computed } from "vue";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const router = useRouter();
const store = usePointsPurchaseStore();
const plan = computed(() => store.purchasedPlan || store.selectedPlan);
const result = computed(() => store.purchaseResult);

onMounted(() => {
  if (!plan.value) {
    router.replace({ name: "mypage" });
  }
});

const backToMypage = () => {
  store.resetAll();
  if (window.opener && window.name === "chargePointsWindow") {
    window.close();
  } else {
    router.replace({ name: "mypage" });
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-background"
  >
    <header class="px-5 py-3 border-b bg-background/80 backdrop-blur">
      <h1 class="font-semibold tracking-tight">購入完了</h1>
    </header>
    <main class="flex-1 px-5 py-10">
      <div class="mx-auto max-w-2xl space-y-10">
        <div class="flex flex-col items-center gap-4 text-center">
          <div
            class="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold tracking-tight">
            購入が完了しました
          </h2>
          <p class="text-sm text-muted-foreground max-w-md">
            ポイントは即時に反映されています。下記の内容をご確認ください。
          </p>
        </div>

        <Card
          v-if="plan"
          class="bg-card/70 backdrop-blur-sm border border-primary/30"
        >
          <CardHeader class="pb-3">
            <CardTitle class="text-base flex items-center gap-2">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary/20 text-primary text-[11px] font-bold"
                >P</span
              >
              購入内容
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0 text-sm space-y-3">
            <div class="grid grid-cols-2 gap-y-1 text-[13px]">
              <div class="text-muted-foreground/70">プラン</div>
              <div class="font-medium text-right">{{ plan.name }}</div>
              <div class="text-muted-foreground/70">ポイント</div>
              <div class="font-medium text-right">
                {{ plan.points.toLocaleString() }} pt
              </div>
              <div class="text-muted-foreground/70">価格</div>
              <div class="font-medium text-right">
                ¥{{ plan.price.toLocaleString() }}
              </div>
              <template v-if="result">
                <div class="text-muted-foreground/70">付与ポイント</div>
                <div
                  class="font-medium text-right text-emerald-600 dark:text-emerald-400"
                >
                  +{{ result.addedPoints.toLocaleString() }} pt
                </div>
                <div class="text-muted-foreground/70">新しい残高</div>
                <div class="font-medium text-right">
                  {{ result.newBalance.toLocaleString() }} pt
                </div>
              </template>
            </div>
            <div
              class="pt-3 border-t text-[11px] text-muted-foreground leading-relaxed"
            >
              このウィンドウを閉じるとマイページに戻ります。
            </div>
          </CardContent>
        </Card>
        <div class="space-y-3">
          <Button class="w-full" @click="backToMypage">マイページに戻る</Button>
        </div>
      </div>
    </main>
  </div>
</template>
