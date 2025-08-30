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
    return;
  }
  if (diff <= 0) {
    if (!isFinished) {
      display.value = finishedText.value ?? "終了";
      clear();
      emit("finished");
      isFinished = true;
      return;
    }
  } else {
    isFinished = false;
  }
  display.value = format(diff);
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
  <span>残り時間:{{ display }}</span>
</template>
