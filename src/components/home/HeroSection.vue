<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import MascotImage from "@/components/MascotImage.vue";
import PreRegisterModal from "@/components/PreRegisterModal.vue";

const router = useRouter();
const { isAuthenticated } = useAuth();
const showPreRegisterModal = ref(false);

function goSearch() {
  router.push({ name: "search" });
}
function openPreRegister() {
  showPreRegisterModal.value = true;
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
          「あと1秒」が永遠に感じる
        </h1>
        <p class="text-lg text-muted-foreground max-w-prose">
          伸び続けるカウントダウンと読み合い。ライブ感のあるペニーオークションで、欲しかった商品を低価格で手に入れるチャンス。<br
            class="hidden md:block"
          />
          今すぐ参加して緊張と興奮のカウントダウンを体験しよう。
        </p>
        <div class="flex flex-wrap gap-4">
          <template v-if="isAuthenticated">
            <Button
              @click="goSearch"
              class="px-6 py-3 font-medium shadow hover:opacity-90"
            >
              オークションを見る
            </Button>
            <Button
              @click="goCharge"
              variant="secondary"
              class="px-6 py-3 font-medium border-primary/60 text-primary hover:opacity-80"
            >
              ポイントをチャージ
            </Button>
          </template>
          <template v-if="!isAuthenticated">
            <Button
              @click="openPreRegister"
              class="px-6 py-3 font-medium shadow hover:opacity-90"
            >
              5,000P受け取って始める
            </Button>
            <Button
              @click="goSearch"
              variant="secondary"
              class="px-6 py-3 font-medium border-primary/60 text-primary hover:opacity-80"
            >
              オークションを見る
            </Button>
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
          class="aspect-[16/10] rounded-xl border bg-background/40 backdrop-blur shadow-inner overflow-hidden flex"
        >
          <div
            class="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-fuchsia-400/20 animate-pulse"
          ></div>
          <div class="relative z-10 flex w-full h-full">
            <div
              class="flex-1 flex flex-col justify-center items-center px-6 text-center gap-2"
            >
              <p class="font-semibold text-lg mb-1">リアルタイム入札</p>
              <p class="text-sm text-muted-foreground leading-relaxed">
                カウントダウンが伸び続ける攻防。<br
                  class="hidden sm:block"
                />最後の 1 秒を制するのは誰だ？
              </p>
            </div>
            <div class="hidden sm:flex items-end justify-end pr-4 pb-2">
              <MascotImage
                random
                :exclude="['dogeza', 'dogeza2', 'ojigi2', 'ojigi']"
                :size="180"
                decorative
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <PreRegisterModal
      :open="showPreRegisterModal"
      @update:open="showPreRegisterModal = $event"
    />
  </section>
</template>

<style scoped></style>
