<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useNotificationStore } from "@/stores/notifications";

const store = useNotificationStore();

const errors = computed(() => store.items.filter((i) => i.type === "error"));

let timer: number | null = null;
function tick() {
  store.pruneExpired();
}

onMounted(() => {
  timer = window.setInterval(tick, 1500);
});
onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

function close(id: number) {
  store.remove(id);
}
</script>

<template>
  <div
    class="fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-3 px-2 pointer-events-none"
  >
    <TransitionGroup name="toast">
      <div
        v-for="n in errors"
        :key="n.id"
        class="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/90 text-destructive-foreground shadow-lg backdrop-blur-sm overflow-hidden pointer-events-auto"
        role="alert"
        :aria-live="'assertive'"
      >
        <div class="flex items-start gap-3 p-3">
          <div class="pt-0.5">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <div class="flex-1 text-sm leading-relaxed whitespace-pre-line">
            {{ n.message }}
          </div>
          <button
            @click="close(n.id)"
            class="text-destructive-foreground/80 hover:text-destructive-foreground transition"
            aria-label="閉じる"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="h-0.5 w-full bg-destructive/40">
          <div
            class="h-full bg-destructive-foreground/70 animate-[shrink_8s_linear_forwards] origin-left"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-enter-active {
  transition: all 0.18s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}
.toast-leave-from {
  opacity: 1;
  height: auto;
}
.toast-leave-to {
  opacity: 0;
  height: 0;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.toast-leave-active {
  transition: all 0.15s ease;
  overflow: hidden;
}
@keyframes shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
