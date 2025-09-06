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
    <main class="flex-1 px-5 py-6">
      <div class="mx-auto max-w-md space-y-6">
        <Card v-if="plan">
          <CardHeader class="pb-2">
            <CardTitle class="text-lg">ご購入ありがとうございました</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2 pt-0 text-sm">
            <p class="text-muted-foreground">以下のプランを購入しました:</p>
            <p>
              <strong>{{ plan.name }}</strong
              ><br />
              ポイント: {{ plan.points.toLocaleString() }} pt<br />
              価格: \{{ plan.price.toLocaleString() }}
            </p>
            <div v-if="result" class="pt-1 border-t text-sm space-y-1">
              <p>
                付与ポイント:
                <strong>{{ result.addedPoints.toLocaleString() }}</strong> pt
              </p>
              <p>
                残高:
                <strong>{{ result.newBalance.toLocaleString() }}</strong> pt
              </p>
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
