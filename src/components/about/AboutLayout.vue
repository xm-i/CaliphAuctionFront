<script setup lang="ts">
import { onMounted, ref, provide, onBeforeUnmount } from "vue";

interface SectionMeta {
  id: string;
  title: string;
}

const props = defineProps<{
  title: string;
  description?: string;
  enableToc?: boolean;
}>();
const enableToc = props.enableToc !== false;

const sections = ref<SectionMeta[]>([]);
const activeId = ref<string>("");

// Provide a register function for child sections
provide("aboutSectionsRegister", (meta: SectionMeta) => {
  if (!sections.value.find((s) => s.id === meta.id)) {
    sections.value.push(meta);
  }
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!enableToc) return;
  const opts: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px 0px -55% 0px",
    threshold: [0, 1.0],
  };
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = (e.target as HTMLElement).id;
        if (id) activeId.value = id;
      }
    });
  }, opts);
  sections.value.forEach((meta) => {
    const el = document.getElementById(meta.id);
    if (el) observer?.observe(el);
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <div class="relative">
    <div
      class="absolute inset-0 pointer-events-none select-none opacity-40 dark:opacity-20 [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.25),transparent_70%)] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
    ></div>
    <div class="relative mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">
      <header class="mb-10 space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          {{ props.title }}
        </h1>
        <p
          v-if="props.description"
          class="text-muted-foreground text-sm md:text-base leading-relaxed max-w-3xl"
        >
          {{ props.description }}
        </p>
      </header>
      <div
        :class="[
          'lg:grid gap-10',
          enableToc ? 'lg:grid-cols-[minmax(0,3fr)_280px]' : '',
        ]"
      >
        <main id="about-main" class="space-y-10">
          <slot />
        </main>
        <aside v-if="enableToc && sections.length > 3" class="hidden lg:block">
          <nav
            aria-label="ページ内目次"
            class="sticky top-28 rounded-lg border bg-card/60 backdrop-blur p-4 text-sm max-h-[70vh] overflow-auto"
          >
            <p
              class="font-semibold text-xs mb-3 tracking-wide text-muted-foreground"
            >
              CONTENTS
            </p>
            <ul class="space-y-2">
              <li v-for="s in sections" :key="s.id">
                <a
                  :href="`#${s.id}`"
                  class="group block rounded px-2 py-1 transition-colors"
                  :class="
                    activeId === s.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/60'
                  "
                  >{{ s.title }}</a
                >
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
