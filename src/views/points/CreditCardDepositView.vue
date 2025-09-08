<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createCreditCardDeposit, purchasePoints } from "@/api/points";
import { isValidCardNumber } from "@/utils";

const router = useRouter();
const store = usePointsPurchaseStore();
const plan = computed(() => store.selectedPlan);

if (!plan.value) {
  router.replace({ name: "mypage-charge" });
}

const cardNumber = ref("");
const cardHolder = ref("");
const expiryMonth = ref("");
const expiryYear = ref("");
const cvv = ref("");

const submitting = ref(false);
const error = ref<string | null>(null);

const cardValid = computed(() => isValidCardNumber(cardNumber.value));
const canSubmit = computed(
  () =>
    !!plan.value &&
    !cardValid.value &&
    cardHolder.value &&
    expiryMonth.value &&
    expiryYear.value &&
    cvv.value &&
    !submitting.value
);

async function submit() {
  if (!canSubmit.value || !plan.value) return;
  submitting.value = true;
  error.value = null;
  try {
    const deposit = await createCreditCardDeposit({
      cardNumber: cardNumber.value,
      cardHolder: cardHolder.value,
      expiryMonth: expiryMonth.value,
      expiryYear: expiryYear.value,
      cvv: cvv.value,
      amount: plan.value.price,
    });
    store.setDeposit(deposit);
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
}

function cancel() {
  router.replace({ name: "points-method" });
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-background"
  >
    <header
      class="px-5 py-3 border-b bg-background/80 backdrop-blur flex items-center justify-between"
    >
      <h1 class="font-semibold tracking-tight">クレジットカード決済</h1>
      <Button size="sm" variant="ghost" @click="cancel">戻る</Button>
    </header>
    <main class="flex-1 px-5 py-8">
      <div class="mx-auto max-w-2xl space-y-8">
        <div class="flex flex-col gap-3">
          <h2
            class="text-lg font-semibold tracking-tight flex items-center gap-2"
          >
            <span class="inline-block w-1.5 h-4 rounded bg-primary/70"></span>
            カード決済
          </h2>
          <p class="text-xs text-muted-foreground leading-relaxed">
            カード情報を入力して決済を行います。
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
                class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-primary/60 to-primary/30 text-primary-foreground text-[11px] font-bold"
                >C</span
              >
              カード情報
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0 space-y-5">
            <div
              class="text-[11px] rounded-md border border-blue-300/60 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 px-3 py-2 leading-relaxed flex gap-2"
            >
              <span class="mt-0.5 select-none">💳</span>
              <span>有効なカード番号は入力できません (バリデーション用)。</span>
            </div>
            <div class="space-y-1">
              <label
                class="text-xs font-medium flex items-center justify-between"
              >
                <span>カード番号</span>
                <span
                  v-if="cardNumber && cardNumber.length <= 12"
                  class="text-[10px] text-destructive"
                  >桁数不足</span
                >
                <span
                  v-if="cardNumber && cardValid"
                  class="text-[10px] text-destructive"
                  >有効な番号になっています。</span
                >
                <span
                  v-else-if="cardValid"
                  class="text-[10px] text-emerald-600 dark:text-emerald-400"
                  >OK</span
                >
              </label>
              <input
                v-model="cardNumber"
                inputmode="numeric"
                autocomplete="cc-number"
                type="text"
                placeholder="4242 4242 4242 4242"
                class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">名義</label>
              <input
                v-model="cardHolder"
                type="text"
                placeholder="AKINA NAKAMORI"
                class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div class="space-y-1 col-span-1">
                <label class="text-xs font-medium">月</label>
                <input
                  v-model="expiryMonth"
                  type="text"
                  placeholder="10"
                  class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div class="space-y-1 col-span-1">
                <label class="text-xs font-medium">年(YY)</label>
                <input
                  v-model="expiryYear"
                  type="text"
                  placeholder="27"
                  class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div class="space-y-1 col-span-1">
                <label class="text-xs font-medium">CVV</label>
                <input
                  v-model="cvv"
                  type="text"
                  placeholder="123"
                  class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
            <Button :disabled="!canSubmit" class="w-full" @click="submit">
              <span v-if="!submitting" class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
                ></span>
                カードで支払う
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
