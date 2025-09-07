<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, onMounted } from "vue";

const props = defineProps<{
  endTime: Date;
  intervalMs?: number;
  finishedText?: string;
}>();

const emit = defineEmits<{
  (e: "finished"): void;
}>();

const interval = ref<number | undefined>(undefined);
const display = ref("");
const remainingSeconds = ref<number | null>(null);
const urgent = ref(false);
const severity = ref<"normal" | "warning" | "urgent">("normal");
let isFinished = true;

const finishedText = computed(() => props.finishedText ?? "終了");

function parseEnd(end: Date): number {
  const ms = end.getTime();
  return Number.isNaN(ms) ? NaN : ms;
}

function format(diffMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function tick(targetMs: number) {
  const now = Date.now();
  const diff = targetMs - now;
  if (!Number.isFinite(diff) || Number.isNaN(diff)) {
    display.value = "-";
    remainingSeconds.value = null;
    urgent.value = false;
    severity.value = "normal";
    return;
  }
  if (diff <= -1000) {
    if (!isFinished) {
      clear();
      emit("finished");
      isFinished = true;
      return;
    }
    display.value = finishedText.value ?? "終了";
    remainingSeconds.value = 0;
    urgent.value = false;
    severity.value = "normal";
  } else {
    isFinished = false;
    display.value = format(diff);
    const secs = Math.max(0, Math.floor(diff / 1000));
    remainingSeconds.value = secs;
    urgent.value = secs <= 10;
    if (secs <= 10) severity.value = "urgent";
    else if (secs <= 60) severity.value = "warning";
    else severity.value = "normal";
  }
}

function clear() {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = undefined;
  }
}

function start() {
  clear();
  const targetMs = parseEnd(props.endTime);
  if (Number.isNaN(targetMs)) {
    display.value = "-";
    return;
  }
  tick(targetMs);
  interval.value = window.setInterval(
    () => tick(targetMs),
    props.intervalMs ?? 1000
  );
}

onMounted(start);
watch(
  () => props.endTime,
  () => start(),
  { immediate: false }
);

onBeforeUnmount(clear);
</script>

<template>
  <slot
    :text="display"
    :remaining-seconds="remainingSeconds"
    :urgent="urgent"
    :severity="severity"
  >
    <span
      :class="[
        'inline-flex items-center gap-1 font-medium tracking-tight transition-all',
        severity === 'urgent' && 'text-destructive animate-pulse scale-[1.5]',
        severity === 'warning' && 'text-accent font-semibold',
        severity === 'normal' && 'text-foreground/70',
      ]"
    >
      <span
        class="inline-block rounded-full w-3.5 h-3.5"
        :class="[
          severity === 'urgent' && 'bg-destructive animate-ping-slow',
          severity === 'warning' && 'bg-accent/80 animate-pulse',
          severity === 'normal' && 'bg-primary/40',
        ]"
      ></span>
      {{ display }}
    </span>
  </slot>
</template>
