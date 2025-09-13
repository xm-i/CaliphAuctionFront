<script setup lang="ts">
import AuctionItemRealtimeGrid from "@/components/AuctionItemRealtimeGrid.vue";
import {
  searchAuctions,
  type SearchResponse,
  getCategories,
  type CategoryDto,
} from "@/api/auction";
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
import { Button } from "@/components/ui/button";

const route = useRoute();
const loading = ref(false);
const total = ref<number | null>(null);
const lastResponse = ref<SearchResponse | null>(null);
const categories = ref<CategoryDto[]>([]);
const loadingCategories = ref(false);
const categoryError = ref<string | null>(null);

async function fetchAll() {
  const categoryId = route.query.categoryId as string | undefined;
  loading.value = true;
  try {
    const res = await searchAuctions({
      categoryId: categoryId ? Number(categoryId) : undefined,
    } as any);
    lastResponse.value = res;
    total.value = res.items.length;
    return res;
  } finally {
    loading.value = false;
  }
}

const gridRef = ref<InstanceType<typeof AuctionItemRealtimeGrid> | null>(null);

const categoryId = computed(() => route.query.categoryId as string | undefined);
const categoryName = computed(() => {
  if (!categoryId.value) return null;
  const idNum = Number(categoryId.value);
  const c = categories.value.find((c) => c.id === idNum);
  return c?.name || null;
});

async function ensureCategories() {
  if (categories.value.length || loadingCategories.value) return;
  loadingCategories.value = true;
  categoryError.value = null;
  try {
    categories.value = await getCategories();
  } catch {
    categoryError.value = "カテゴリ取得失敗";
  } finally {
    loadingCategories.value = false;
  }
}

watch(
  () => route.query.categoryId,
  async () => {
    if (categoryId.value) await ensureCategories();
    await gridRef.value?.reload();
  }
);

// 初回（カテゴリ指定されていたら取得）
if (categoryId.value) ensureCategories();
</script>

<template>
  <section class="container lg:w-[90%] py-6 space-y-8">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
            検索
            <span
              v-if="total !== null"
              class="text-sm font-normal text-muted-foreground"
              >{{ total }} 件</span
            >
          </h1>
          <p class="text-sm text-muted-foreground">
            カテゴリで商品を探索できます。
          </p>
        </div>
        <div class="flex gap-2 md:justify-end">
          <Button
            size="sm"
            variant="secondary"
            :disabled="loading"
            @click="gridRef?.reload()"
            >再読み込み</Button
          >
        </div>
      </div>

      <div
        v-if="categoryId"
        class="flex flex-wrap gap-2 text-[11px] items-center"
      >
        <span
          class="px-2 py-0.5 rounded-full bg-primary/15 text-primary"
          v-if="categoryName"
          >カテゴリ: {{ categoryName }}</span
        >
        <span
          v-else
          class="px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
        >
          {{
            loadingCategories ? "読み込み中…" : categoryError || "カテゴリ不明"
          }}
        </span>
      </div>
    </div>

    <div class="pt-2">
      <AuctionItemRealtimeGrid
        ref="gridRef"
        :fetch-fn="fetchAll"
        :empty-message="'商品がありません。'"
        :animate="true"
      />
    </div>
  </section>
</template>

<style scoped></style>
