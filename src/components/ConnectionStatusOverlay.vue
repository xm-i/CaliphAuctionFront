<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { auctionHub } from "@/realtime/auctionHub";

const visible = ref(false);
const state = ref<"connected" | "reconnecting" | "disconnected">("connected");
let unbind: (() => void) | null = null;

onMounted(() => {
  unbind = auctionHub.onStateChange((s) => {
    state.value = s;
    visible.value = s !== "connected";
  });
});
onUnmounted(() => {
  if (unbind) unbind();
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-6 bg-background/70 backdrop-blur-sm px-6"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex items-center gap-3">
          <span class="relative flex h-5 w-5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-40"
            ></span>
            <span
              class="relative inline-flex rounded-full h-5 w-5 bg-orange-500"
            ></span>
          </span>
          <h2 class="text-xl font-semibold tracking-tight">
            {{ state === "reconnecting" ? "再接続中…" : "切断されました" }}
          </h2>
        </div>
        <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
          リアルタイム更新が一時停止しています。
          {{
            state === "reconnecting"
              ? "接続の復旧を待っています。"
              : "ネットワークを確認してください。"
          }}
        </p>
      </div>
      <div class="text-xs text-muted-foreground/80">状態: {{ state }}</div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
