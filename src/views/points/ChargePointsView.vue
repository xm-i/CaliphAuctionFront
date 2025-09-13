<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import {
  getPointPlans,
  type PointPlanDto,
  purchasePoints,
  type DepositResponse,
} from "@/api/points";
import PaymentMethodModal from "@/components/payment/PaymentMethodModal.vue";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { usePointsBalanceStore } from "@/stores/pointsBalance";

const router = useRouter();
const isPopup = ref(false);

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const plans = ref<PointPlanDto[]>([]);
const selecting = ref<number | null>(null);
const showPaymentModal = ref(false);
const purchasing = ref(false);
const purchaseError = ref<string | null>(null);
const deposit = ref<DepositResponse | null>(null);

const fetchPlans = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getPointPlans();
    plans.value = data.sort((a, b) => a.price - b.price);
  } catch (e: any) {
    error.value = "取得に失敗しました";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  isPopup.value = !!window.opener && window.name === "chargePointsWindow";
  fetchPlans();
});

const closeOrBack = () => {
  if (isPopup.value) {
    window.close();
  } else {
    router.push({ name: "mypage" });
  }
};

const selectPlan = (id: number) => {
  selecting.value = id;
};

const store = usePointsPurchaseStore();
const balanceStore = usePointsBalanceStore();

const selectedPlan = computed(
  () => plans.value.find((p) => p.id === selecting.value) || null
);

function proceed() {
  if (!selectedPlan.value) return;
  store.selectPlan(selectedPlan.value);
  showPaymentModal.value = true;
}

async function onPaymentCompleted(d: DepositResponse) {
  deposit.value = d;
  showPaymentModal.value = false;
  if (!selectedPlan.value) return;
  purchasing.value = true;
  purchaseError.value = null;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await purchasePoints({
      depositToken: d.depositToken,
      pointPlanId: selectedPlan.value.id,
    });
    store.setDeposit(d);
    store.setPurchaseResult(res);
    await balanceStore.updateBalanceFromApi();
    router.replace({ name: "points-complete" });
  } catch (e: any) {
    purchaseError.value = "ポイント購入処理に失敗しました";
  } finally {
    purchasing.value = false;
  }
}

async function onPaymentModalClosed() {
  showPaymentModal.value = false;
}
</script>

<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-background flex flex-col relative"
  >
    <header
      class="flex items-center justify-between px-5 py-3 border-b bg-background/80 backdrop-blur"
    >
      <h1 class="text-xl font-bold tracking-tight">ポイント購入</h1>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="closeOrBack">閉じる</Button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto px-5 py-8">
      <div class="mx-auto max-w-2xl space-y-8">
        <!-- Heading -->
        <div class="flex flex-col gap-3">
          <h2
            class="text-lg font-semibold tracking-tight flex items-center gap-2"
          >
            <span class="inline-block w-1.5 h-4 rounded bg-primary/70"></span>
            ポイントプランを選択
          </h2>
          <p class="text-xs text-muted-foreground leading-relaxed">
            ご希望のポイントパックを選び、次へ進んで支払い方法を選択します。価格は税込表示です。
          </p>
        </div>
        <!-- Plans -->
        <div v-if="loading" class="grid gap-4">
          <div
            v-for="n in 4"
            :key="n"
            class="h-24 rounded-md border bg-muted animate-pulse"
          />
        </div>
        <div v-else>
          <div v-auto-animate class="grid gap-4 sm:grid-cols-2">
            <Button
              v-for="plan in plans"
              :key="plan.id"
              type="button"
              variant="secondary"
              :aria-pressed="selecting === plan.id"
              @click="selectPlan(plan.id)"
              :class="[
                'w-full h-auto p-0 text-left group relative flex flex-col rounded-lg overflow-hidden bg-card/70 backdrop-blur-sm transition',
                selecting === plan.id
                  ? 'border-primary/60 ring-1 ring-primary/30 shadow-sm'
                  : 'border-border/70',
                'hover:shadow-md hover:border-primary/40 focus-visible:ring-primary/40',
              ]"
            >
              <div class="p-4 flex flex-col gap-3 w-full">
                <div class="flex items-start justify-between w-full">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-semibold tracking-tight text-sm">{{
                      plan.name
                    }}</span>
                    <span class="text-[11px] text-muted-foreground"
                      >{{ plan.points.toLocaleString() }} pt</span
                    >
                  </div>
                  <span
                    v-if="plan.price < plan.points"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium tracking-wide"
                    >BONUS</span
                  >
                </div>
                <div
                  class="flex items-end justify-between text-sm font-medium tabular-nums"
                >
                  <span>￥{{ plan.price.toLocaleString() }}</span>
                  <span class="text-[11px] text-muted-foreground"
                    >{{ (plan.price / plan.points).toFixed(2) }} 円 / pt</span
                  >
                </div>
                <div
                  v-if="plan.price < plan.points"
                  class="text-[10px] text-emerald-600 dark:text-emerald-400"
                >
                  {{ Math.round((1 - plan.price / plan.points) * 100) }}% OFF
                  相当
                </div>
                <span
                  v-if="selecting === plan.id"
                  class="absolute bottom-2 right-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-medium"
                  >選択中</span
                >
                <span
                  class="absolute inset-px rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 to-transparent"
                />
              </div>
            </Button>
          </div>
          <p v-if="!plans.length" class="text-sm text-muted-foreground">
            利用可能なプランがありません。
          </p>
        </div>
        <!-- Actions -->
        <div class="space-y-3 pt-2">
          <Button
            class="w-full"
            :disabled="!selecting || loading || !!error"
            @click="proceed"
          >
            選択したプランで進む
          </Button>
          <Button variant="secondary" class="w-full" @click="closeOrBack"
            >キャンセル</Button
          >
          <p v-if="purchaseError" class="text-xs text-destructive">
            {{ purchaseError }}
          </p>
          <p
            v-if="purchasing"
            class="text-xs text-muted-foreground flex items-center gap-2"
          >
            <span
              class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
            ></span>
            購入処理中...
          </p>
        </div>
        <!-- Notes -->
        <div
          class="pt-4 border-t text-[11px] leading-relaxed text-muted-foreground space-y-2"
        >
          <p>
            ご購入いただいたポイントは即時反映され、入札やサービス利用にお使いいただけます。
          </p>
          <p>
            購入後の返金・キャンセルは承れませんので、金額をよくご確認ください。
          </p>
          <p>不明点がある場合は、購入前にサポートまでお問い合わせください。</p>
        </div>
      </div>
    </main>
    <PaymentMethodModal
      :open="showPaymentModal"
      :amount="selectedPlan?.price || 0"
      @completed="onPaymentCompleted"
      @close="onPaymentModalClosed"
    >
      <div
        v-if="selectedPlan"
        class="rounded-md border bg-background/60 backdrop-blur px-3 py-2 text-[11px] leading-relaxed space-y-1"
      >
        <div class="flex items-center justify-between text-xs font-medium">
          <span class="flex items-center gap-1">
            <span
              class="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/20 text-primary text-[10px] font-bold"
              >P</span
            >
            {{ selectedPlan.name }}
          </span>
          <span class="tabular-nums"
            >￥{{ selectedPlan.price.toLocaleString() }}</span
          >
        </div>
        <div
          class="flex items-center justify-between text-[10px] text-muted-foreground/80"
        >
          <span>ポイント</span>
          <span class="font-medium tabular-nums"
            >{{ selectedPlan.points.toLocaleString() }} pt</span
          >
        </div>
        <div
          v-if="selectedPlan.price < selectedPlan.points"
          class="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between pt-1 border-t"
        >
          <span>お得度</span>
          <span>
            {{
              Math.round((1 - selectedPlan.price / selectedPlan.points) * 100)
            }}% OFF 相当
          </span>
        </div>
      </div>
    </PaymentMethodModal>
    <!-- Full-screen purchasing overlay -->
    <div
      v-if="purchasing"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-sm"
    >
      <div
        class="flex flex-col items-center gap-4 px-6 py-8 rounded-lg border bg-card/70 shadow-lg"
      >
        <span
          class="inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        ></span>
        <div class="flex flex-col items-center gap-1">
          <p class="text-sm font-medium tracking-tight">購入処理中...</p>
          <p class="text-[11px] text-muted-foreground">
            しばらくそのままでお待ちください
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
