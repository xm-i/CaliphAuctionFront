<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { numberWithComma } from "@/lib/utils";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { placeBid, AuctionStatus } from "@/api/auction";

const props = defineProps<{
  auctionItemId: number;
  currentPrice: number;
  disabled?: boolean;
  highestBidUserId: number | null;
  loading: boolean;
  status: AuctionStatus;
}>();

const emit = defineEmits<{
  (e: "placed"): void;
  (e: "error", message: string): void;
  (e: "onBeaforeClick"): void; // (typo intentional per request)
}>();

const placing = ref(false);
const router = useRouter();
const route = useRoute();
const { isAuthenticated, user } = useAuth();

const nextAmount = computed(() => props.currentPrice + 1);
const isSelfHighest = computed(
  () =>
    user.value?.id != null &&
    props.highestBidUserId != null &&
    user.value.id === props.highestBidUserId
);

async function onClick() {
  if (!isAuthenticated.value) {
    router.push({ name: "signin", query: { redirect: route.fullPath } });
    return;
  }
  if (props.loading || props.disabled || placing.value || isSelfHighest.value) {
    return;
  }
  emit("onBeaforeClick");
  placing.value = true;
  try {
    await placeBid({
      auctionItemId: props.auctionItemId,
      bidAmount: nextAmount.value,
    });
    emit("placed");
  } catch (e: any) {
    const message = "入札に失敗しました";
    emit("error", message);
  } finally {
    placing.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="text-sm text-muted-foreground">
      次の入札額: ¥{{ numberWithComma(nextAmount) }}
    </div>
    <Button v-if="status === AuctionStatus.Ended" size="lg" disabled>
      終了
    </Button>
    <Button v-else-if="loading" size="lg" disabled> 更新中 </Button>
    <Button
      v-else-if="!isAuthenticated"
      size="lg"
      :disabled="disabled"
      @click="onClick"
    >
      ログインして入札
    </Button>
    <Button v-else-if="isSelfHighest" size="lg" disabled>
      最高入札者です
    </Button>
    <Button v-else-if="placing" size="lg" disabled> 処理中... </Button>
    <Button v-else size="lg" :disabled="disabled" @click="onClick">
      入札
    </Button>
    <p v-if="isSelfHighest" class="text-xs text-muted-foreground">
      あなたが最高入札者です
    </p>
  </div>
</template>
