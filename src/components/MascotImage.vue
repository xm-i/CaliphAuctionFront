<script setup lang="ts">
import { computed } from "vue";
import {
  getMascotImage,
  getRandomMascotMood,
  type MascotMood,
} from "@/constants/mascotImages";

interface Props {
  mood?: MascotMood; // Explicit mood
  random?: boolean; // If true, pick a random mood (overrides provided mood unless exclude contains it)
  exclude?: MascotMood | MascotMood[]; // Exclude these moods when random
  size?: number | string; // Tailwind size or px value
  alt?: string; // Override alt text
  decorative?: boolean; // If true, aria-hidden
  rounded?: boolean; // If true, apply rounded-xl
  ring?: boolean; // If true, add subtle ring
}

const props = withDefaults(defineProps<Props>(), {
  mood: "normal",
  random: false,
  size: "160",
  alt: "",
  decorative: false,
  rounded: true,
  ring: false,
});

const actualMood = computed(() => {
  return props.random ? getRandomMascotMood(props.exclude) : props.mood;
});

const src = computed(() => getMascotImage(actualMood.value));

const styleSize = computed(() => {
  if (typeof props.size === "number") return `${props.size}px`;
  if (/^\d+$/.test(String(props.size))) return `${props.size}px`;
  return props.size;
});

const ariaHidden = computed(() => (props.decorative ? "true" : undefined));
const altText = computed(() => {
  if (props.decorative) return "";
  if (props.alt) return props.alt;
  switch (actualMood.value) {
    case "smiling":
      return "マスコット(スマイル)";
    case "lookdown":
    case "lookdown2":
      return "マスコット(見下ろし)";
    case "dogeza":
    case "dogeza2":
      return "マスコット(土下座)";
    case "ojigi":
    case "ojigi2":
      return "マスコット(お辞儀)";
    case "pray":
      return "マスコット(祈り)";
    default:
      return "マスコット";
  }
});
</script>

<template>
  <img
    :src="src"
    :alt="altText"
    :aria-hidden="ariaHidden"
    class="select-none pointer-events-none object-contain"
    :class="[rounded ? 'rounded-xl' : '', ring ? 'ring-1 ring-border/50' : '']"
    :style="{ width: styleSize, height: styleSize }"
    decoding="async"
    loading="lazy"
  />
</template>

<!--
Usage Examples:
  <MascotImage mood="smiling" size="6rem" />
  <MascotImage random :exclude="['dogeza']" :size="120" decorative />
  <MascotImage random ring />
Add new mood:
  1. Place file in src/assets (e.g., majin_newpose.png)
  2. Import and map in src/constants/mascotImages.ts
  3. Use <MascotImage mood="newpose" />
-->

<style scoped></style>
