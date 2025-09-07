<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { getPointPlans, type PointPlanDto } from "@/api/points";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";

const router = useRouter();
const isPopup = ref(false);

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const plans = ref<PointPlanDto[]>([]);
const selecting = ref<number | null>(null);

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
const proceed = () => {
  if (!selecting.value) return;
  const plan = plans.value.find((p) => p.id === selecting.value);
  if (!plan) return;
  store.selectPlan(plan);
  router.push({ name: "points-method" });
};
</script>

<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-background flex flex-col"
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

        <div v-if="loading" class="grid gap-4">
          <div
            v-for="n in 4"
            :key="n"
            class="h-24 rounded-md border bg-muted animate-pulse"
          ></div>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2" v-auto-animate>
          <button
            v-for="plan in plans"
            :key="plan.id"
            type="button"
            @click="selectPlan(plan.id)"
            :class="[
              'group relative rounded-lg border bg-card/70 backdrop-blur-sm p-4 text-left flex flex-col gap-3 shadow-sm ring-1 ring-border/60 hover:shadow-md hover:border-primary/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
              selecting === plan.id ? 'border-primary/50 ring-primary/40' : '',
            ]"
          >
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
              {{ Math.round((1 - plan.price / plan.points) * 100) }}% OFF 相当
            </div>
            <span
              v-if="selecting === plan.id"
              class="absolute bottom-2 right-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-medium"
            >
              選択中
            </span>
            <span
              class="absolute inset-px rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 to-transparent"
            />
          </button>
          <p v-if="!plans.length" class="text-sm text-muted-foreground">
            利用可能なプランがありません。
          </p>
        </div>

        <div class="space-y-3 pt-2">
          <Button
            class="w-full"
            :disabled="!selecting || loading || !!error"
            @click="proceed"
          >
            選択したプランで進む
          </Button>
          <Button variant="outline" class="w-full" @click="closeOrBack">
            キャンセル
          </Button>
        </div>

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
  </div>
</template>
