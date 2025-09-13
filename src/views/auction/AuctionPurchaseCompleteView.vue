<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { ref, onMounted } from "vue";
import { getPurchaseStatus } from "@/api/purchases";

const route = useRoute();
const router = useRouter();
const auctionId = Number(route.params.id);
const loading = ref(true);
const status = ref<any | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    status.value = await getPurchaseStatus(auctionId);
  } catch (e: any) {
    error.value = "購入結果の取得に失敗しました";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-xl mx-auto p-8 space-y-6 text-center">
    <div v-if="loading" class="space-y-4">
      <div class="h-8 w-48 mx-auto bg-muted/40 rounded animate-pulse" />
      <div class="h-24 bg-muted/30 rounded animate-pulse" />
    </div>
    <template v-else>
      <h1 class="text-2xl font-semibold tracking-tight">購入が完了しました</h1>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <div
        v-else
        class="bg-card/60 border rounded-lg p-5 text-sm text-left space-y-2"
      >
        <p>
          <span class="text-muted-foreground/70">オークションID:</span>
          {{ auctionId }}
        </p>
        <p>
          <span class="text-muted-foreground/70">お届け日:</span>
          {{ status?.deliveryDate }}
        </p>
        <p>
          <span class="text-muted-foreground/70">時間帯:</span>
          {{ status?.deliveryTimeSlot }}
        </p>
        <p>
          <span class="text-muted-foreground/70">配送業者:</span>
          {{ status?.shippingCarrier }}
        </p>
        <p>
          <span class="text-muted-foreground/70">住所:</span>
          {{ status?.prefecture }} {{ status?.city }}
          {{ status?.addressLine1 }} {{ status?.addressLine2 }}
        </p>
      </div>
      <div class="flex justify-center gap-3 pt-2">
        <Button
          variant="outline"
          @click="
            () =>
              router.replace({
                name: 'auction-detail',
                params: { id: auctionId },
              })
          "
          >商品へ戻る</Button
        >
        <Button @click="() => router.replace({ name: 'mypage-won' })"
          >落札履歴へ</Button
        >
      </div>
    </template>
  </div>
</template>
