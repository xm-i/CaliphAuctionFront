<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

    <main class="flex-1 overflow-y-auto px-5 py-6">
      <div class="mx-auto max-w-md space-y-6">
        <p class="text-sm text-muted-foreground">
          ご希望のポイントパックを選択してください。価格は税込表示です。
        </p>

        <div v-if="loading" class="grid gap-4">
          <div
            v-for="n in 4"
            :key="n"
            class="h-24 rounded-md border bg-muted animate-pulse"
          ></div>
        </div>
        <div v-else class="grid gap-4" v-auto-animate>
          <Card
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'cursor-pointer transition border shadow-sm hover:shadow-md',
              selecting === plan.id ? 'ring-2 ring-primary border-primary' : '',
            ]"
            @click="selectPlan(plan.id)"
          >
            <CardHeader class="pb-1">
              <CardTitle class="flex items-center justify-between text-base">
                <div class="flex flex-col">
                  <span class="font-semibold">{{ plan.name }}</span>
                  <span class="text-xs text-muted-foreground"
                    >{{ plan.points.toLocaleString() }} pt</span
                  >
                </div>
                <span
                  v-if="plan.price < plan.points"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium tracking-wide"
                  >BONUS</span
                >
              </CardTitle>
            </CardHeader>
            <CardContent class="pt-0">
              <p class="text-sm font-medium">
                ￥{{ plan.price.toLocaleString() }}
                <span
                  v-if="plan.price < plan.points"
                  class="ml-2 text-xs text-muted-foreground"
                  >({{ Math.round((1 - plan.price / plan.points) * 100) }}%
                  OFF)</span
                >
              </p>
            </CardContent>
          </Card>
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
          class="pt-4 border-t text-xs leading-relaxed text-muted-foreground space-y-2"
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
