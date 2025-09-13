<script setup lang="ts">
import { inject, onMounted } from "vue";

const props = defineProps<{ title?: string; id?: string }>();
const register = inject<(meta: { id: string; title: string }) => void>(
  "aboutSectionsRegister",
  () => {}
);

const sectionId =
  props.id ||
  (props.title
    ? props.title
        .toLowerCase()
        .replace(/[^a-z0-9一-龯ぁ-んァ-ヶー]/gi, "-")
        .replace(/--+/g, "-")
        .replace(/^-|-$/g, "")
    : "");

onMounted(() => {
  if (props.title && sectionId) {
    register({ id: sectionId, title: props.title });
  }
});
</script>

<template>
  <section
    :id="sectionId"
    data-about-section
    class="scroll-mt-24 space-y-4 md:space-y-5"
  >
    <header v-if="title" class="flex items-center gap-3">
      <h2 class="text-lg md:text-xl font-semibold tracking-tight leading-snug">
        {{ title }}
      </h2>
      <div class="h-px flex-1 bg-border/60"></div>
    </header>
    <div class="text-sm md:text-base leading-relaxed space-y-4">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>
