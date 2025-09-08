<template>
  <figure
    class="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.08] bg-gray-950/[.015] p-5 hover:bg-gray-950/[.06] dark:border-gray-50/[.08] dark:bg-gray-50/[.07] dark:hover:bg-gray-50/[.12] soft-transition"
  >
    <div class="flex flex-row items-center gap-2">
      <span class="text-sm font-medium dark:text-white">
        {{ name }}
        <span
          class="text-xs font-normal text-muted-foreground dark:text-white/60"
          >({{ age }}・{{ gender }})</span
        >
      </span>
    </div>
    <blockquote
      class="mt-2 text-sm leading-relaxed text-foreground/90 dark:text-white/90 line-clamp-2"
    >
      {{ body }}
    </blockquote>
  </figure>
</template>

<script lang="ts" setup>
interface Props {
  name: string;
  age: number | string;
  gender: string; // 男性 / 女性 / 他
  body: string;
}

defineProps<Props>();
</script>
