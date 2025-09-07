<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const router = useRouter();
const store = usePointsPurchaseStore();
const plan = computed(() => store.selectedPlan);

// payment method meta (簡潔な定義)
const methods = [
  {
    id: "paypal",
    title: "PayPal",
    desc: "PayPal ログインして決済",
    route: "points-paypal-login",
    accent: "from-[#253B80] to-[#179BD7]",
    icon: () =>
      `<svg viewBox='0 0 24 24' class='w-5 h-5 text-[#253B80]' aria-hidden='true'>\n<path fill='currentColor' d='M7.6 20.5H4.9a.7.7 0 0 1-.7-.8L6.4 3.3c.1-.4.4-.6.8-.6h6.4c2.2 0 3.9.5 4.9 1.6 1 .9 1.3 2.2 1.1 3.8-.6 3.6-2.7 5.8-6.2 5.8H11c-.3 0-.6.2-.6.5l-.8 5.1a.8.8 0 0 1-.8.7Z'/>\n</svg>`,
  },
  {
    id: "card",
    title: "クレジットカード",
    desc: "カード番号で即時決済",
    route: "points-credit-card",
    accent: "from-primary/40 to-primary/20",
    icon: () =>
      `<svg viewBox='0 0 24 24' class='w-5 h-5 text-primary' aria-hidden='true'>\n<rect x='2' y='5' width='20' height='14' rx='2' ry='2' fill='none' stroke='currentColor' stroke-width='1.5'/>\n<path stroke='currentColor' stroke-width='1.5' d='M2 10h20'/>\n<rect x='6' y='13' width='4' height='2' rx='.5' fill='currentColor'/>\n</svg>`,
  },
  {
    id: "bank",
    title: "銀行振込",
    desc: "後から振込処理を実行",
    route: "points-bank-transfer",
    accent: "from-amber-400/40 to-amber-200/10",
    icon: () =>
      `<svg viewBox='0 0 24 24' class='w-5 h-5 text-amber-600 dark:text-amber-400' aria-hidden='true'>\n<path fill='currentColor' d='M12 3 3 8v1h18V8l-9-5Z'/>\n<path fill='currentColor' d='M5 11h2v7H5zm6 0h2v7h-2zm6 0h2v7h-2zM3 21h18v-2H3v2Z'/>\n</svg>`,
  },
];

if (!plan.value) {
  router.replace({ name: "mypage-charge" });
}

function back() {
  router.replace({ name: "mypage-charge" });
}

function choose(id: string) {
  const m = methods.find((x) => x.id === id);
  if (!m) return;
  router.push({ name: m.route });
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
    <main class="flex-1 px-5 py-8">
      <div class="mx-auto max-w-2xl space-y-8">
        <div class="flex flex-col gap-3">
          <h2
            class="text-lg font-semibold tracking-tight flex items-center gap-2"
          >
            <span class="inline-block w-1.5 h-4 rounded bg-primary/70"></span>
            支払い方法を選択
          </h2>
          <p class="text-xs text-muted-foreground leading-relaxed">
            ご利用中のプランを確認し、希望する決済方法をタップしてください。
          </p>
        </div>

        <Card
          v-if="plan"
          class="border border-primary/30 bg-card/60 backdrop-blur-sm"
        >
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

        <div class="grid gap-4 sm:grid-cols-2">
          <button
            v-for="m in methods"
            :key="m.id"
            type="button"
            class="group relative rounded-lg border bg-card/70 backdrop-blur-sm p-4 text-left flex flex-col gap-2 shadow-sm ring-1 ring-border/60 hover:shadow-md hover:border-primary/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            @click="choose(m.id)"
          >
            <div class="flex items-center gap-2">
              <span
                class="shrink-0 inline-flex items-center justify-center rounded-md bg-gradient-to-br"
                :class="m.accent"
                v-html="m.icon()"
              />
              <span class="font-medium text-sm tracking-tight">{{
                m.title
              }}</span>
            </div>
            <p class="text-[11px] text-muted-foreground leading-snug">
              {{ m.desc }}
            </p>
            <span
              class="absolute inset-px rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 to-transparent"
            />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
