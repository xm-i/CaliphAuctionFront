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
    email.value.length > 3 &&
    password.value.length > 3 &&
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
  store.clearSelection();
  router.replace({ name: "mypage-charge" });
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

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">PayPal アカウント</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 pt-0">
            <div
              class="text-[11px] rounded-md border border-amber-300/60 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-3 py-2 leading-relaxed flex gap-2"
            >
              <span class="mt-0.5 inline-block select-none">☑️</span>
              <span>
                ログインID /
                パスワードは任意の値を入力することで購入操作が完了します。
              </span>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">ログインID (メール)</label>
              <input
                v-model="email"
                type="email"
                placeholder="auction@example.com"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">パスワード</label>
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
            <Button
              :disabled="!canSubmit"
              class="w-full"
              @click="performDepositAndPurchase"
            >
              <span v-if="!submitting">PayPalにログインして購入する</span>
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
