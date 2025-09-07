<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { isAuthenticated } = useAuth();

function goSearch() {
  router.push({ name: "search" });
}
function goSignup() {
  router.push({ name: "signup" });
}
function goCharge() {
  if (isAuthenticated.value) {
    const url = router.resolve({ name: "mypage" }).href;
    window.open(url, "_blank", "noopener");
  } else {
    const url = router.resolve({
      name: "signin",
      query: { redirect: "/mypage" },
    }).href;
    window.open(url, "_blank", "noopener");
  }
}
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 opacity-20 dark:opacity-25"
    ></div>
    <div
      class="relative mx-auto max-w-6xl px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10"
    >
      <div class="w-full md:w-1/2 space-y-6">
        <div
          v-if="!isAuthenticated"
          class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-medium text-primary shadow-sm backdrop-blur-sm animate-pulse"
        >
          <span class="text-lg">🎁</span>
          <span
            >新規登録で
            <span class="font-bold">5,000P</span> 無料プレゼント</span
          >
        </div>
        <h1 class="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          1ポイントで変わる一瞬の駆け引き
        </h1>
        <p class="text-lg text-muted-foreground max-w-prose">
          ライブ感のあるペニーオークションで、欲しかった商品を低価格で手に入れるチャンス。<br
            class="hidden md:block"
          />
          今すぐ参加して緊張と興奮のカウントダウンを体験しよう。
        </p>
        <div class="flex flex-wrap gap-4">
          <template v-if="isAuthenticated">
            <button
              @click="goSearch"
              class="inline-flex items-center rounded-md bg-primary px-6 py-3 text-white font-medium shadow hover:opacity-90 transition"
            >
              オークションを見る
            </button>
            <button
              @click="goCharge"
              class="inline-flex items-center rounded-md border border-primary/60 px-6 py-3 font-medium text-primary hover:bg-primary/10 transition"
            >
              ポイントをチャージ
            </button>
          </template>
          <template v-if="!isAuthenticated">
            <button
              @click="goSignup"
              class="inline-flex items-center rounded-md bg-primary px-6 py-3 text-white font-medium shadow hover:opacity-90 transition"
            >
              5,000P受け取って始める
            </button>
            <button
              @click="goSearch"
              class="inline-flex items-center rounded-md border border-primary/60 px-6 py-3 font-medium text-primary hover:bg-primary/10 transition"
            >
              オークションを見る
            </button>
          </template>
        </div>
        <div class="flex gap-6 pt-4 text-sm">
          <div class="flex flex-col">
            <span class="font-semibold text-xl">24/7</span>
            <span class="text-muted-foreground">稼働</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-xl">2,500+</span>
            <span class="text-muted-foreground">落札実績</span>
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-xl">99.9%</span>
            <span class="text-muted-foreground">稼働率</span>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 relative">
        <div
          class="aspect-[16/10] rounded-xl border bg-background/40 backdrop-blur shadow-inner flex items-center justify-center overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-fuchsia-400/20 animate-pulse"
          ></div>
          <div class="relative z-10 text-center px-6">
            <p class="font-semibold text-lg mb-2">リアルタイム入札</p>
            <p class="text-sm text-muted-foreground">
              カウントダウンが伸び続ける攻防。最後の 1 秒を制するのは誰だ？
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
