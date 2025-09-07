<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createPaypalDeposit, purchasePoints } from "@/api/points";

const router = useRouter();
const store = usePointsPurchaseStore();

const email = ref("");
const password = ref("");
const submitting = ref(false);
const error = ref<string | null>(null);

const plan = computed(() => store.selectedPlan);

onMounted(() => {
  if (!plan.value) {
    router.replace({ name: "mypage-charge" });
  }
});

const canSubmit = computed(
  () =>
    !!plan.value &&
    email.value.length >= 1 &&
    password.value.length >= 1 &&
    !submitting.value
);

const performDepositAndPurchase = async () => {
  if (!canSubmit.value || !plan.value) return;
  submitting.value = true;
  error.value = null;
  try {
    // デポジット作成
    const deposit = await createPaypalDeposit({
      loginId: email.value,
      password: password.value,
      amount: plan.value.price,
    });
    store.setDeposit(deposit);

    // ポイント購入確定
    const result = await purchasePoints({
      depositToken: deposit.depositToken,
      pointPlanId: plan.value.id,
    });
    store.setPurchaseResult(result);
    router.replace({ name: "points-complete" });
  } catch (e: any) {
    error.value = "エラーが発生しました";
  } finally {
    submitting.value = false;
  }
};

const cancel = () => {
  router.replace({ name: "points-method" });
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-background"
  >
    <header
      class="px-5 py-3 border-b bg-background/80 backdrop-blur flex items-center justify-between"
    >
      <h1 class="font-semibold tracking-tight">PayPal ログイン</h1>
      <Button size="sm" variant="ghost" @click="cancel">戻る</Button>
    </header>
    <main class="flex-1 px-5 py-8">
      <div class="mx-auto max-w-2xl space-y-8">
        <div class="flex flex-col gap-3">
          <h2
            class="text-lg font-semibold tracking-tight flex items-center gap-2"
          >
            <span class="inline-block w-1.5 h-4 rounded bg-primary/70"></span>
            PayPal ログイン
          </h2>
          <p class="text-xs text-muted-foreground leading-relaxed">
            選択したポイントプランを PayPal で決済します。
          </p>
        </div>

        <Card
          v-if="plan"
          class="border border-primary/30 bg-card/60 backdrop-blur-sm"
        >
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex flex-col gap-1">
              <span class="text-xs text-muted-foreground font-normal"
                >選択中のプラン</span
              >
              <span class="text-lg font-bold tracking-tight">{{
                plan.name
              }}</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="flex justify-between col-span-2">
              <span class="text-muted-foreground/80">ポイント</span
              ><strong>{{ plan.points.toLocaleString() }} pt</strong>
            </div>
            <div class="flex justify-between col-span-2">
              <span class="text-muted-foreground/80">価格</span
              ><strong>\{{ plan.price.toLocaleString() }}</strong>
            </div>
            <div class="flex justify-between col-span-2">
              <span class="text-muted-foreground/80">1pt あたり</span
              ><strong>{{ (plan.price / plan.points).toFixed(2) }} 円</strong>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-card/70 backdrop-blur-sm">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#253B80] to-[#179BD7] text-white text-[11px] font-bold"
                >P</span
              >
              PayPal アカウント
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-5 pt-0">
            <div
              class="text-[11px] rounded-md border border-amber-300/60 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-3 py-2 leading-relaxed flex gap-2"
            >
              <span class="mt-0.5 inline-block select-none">☑️</span>
              <span>実在のID/パスワードを入力しないでください。</span>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">ログインID (メール)</label>
              <input
                v-model="email"
                type="text"
                placeholder="auction@example.com"
                class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">パスワード</label>
              <input
                v-model="password"
                type="text"
                placeholder="password"
                class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
            <Button
              :disabled="!canSubmit"
              class="w-full"
              @click="performDepositAndPurchase"
            >
              <span v-if="!submitting" class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
                ></span>
                PayPalにログインして購入する
              </span>
              <span v-else class="flex items-center gap-2">
                <span
                  class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                ></span>
                処理中…
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
