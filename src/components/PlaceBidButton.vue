<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { placeBid, AuctionStatus } from "@/api/auction";
import { usePointsBalanceStore } from "@/stores/pointsBalance";

const props = defineProps<{
  auctionItemId: number;
  currentPrice: number;
  bidIncrement: number;
  bidPointCost: number;
  disabled?: boolean;
  highestBidUserId: number | null;
  loading: boolean;
  status: AuctionStatus;
}>();

const emit = defineEmits<{
  (e: "placed"): void;
  (e: "error", message: string): void;
  (e: "onBeaforeClick"): void;
}>();

const placing = ref(false);
const router = useRouter();
const route = useRoute();
const pointsBalanceStore = usePointsBalanceStore();
const { isAuthenticated, user } = useAuth();

const nextAmount = computed(() => props.currentPrice + props.bidIncrement);
const insufficientBalance = computed(() => {
  if (pointsBalanceStore.balance == null) {
    return false;
  }
  return pointsBalanceStore.balance < props.bidPointCost;
});
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
  if (
    props.loading ||
    props.disabled ||
    placing.value ||
    isSelfHighest.value ||
    insufficientBalance.value
  ) {
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
    pointsBalanceStore.updateBalanceFromApi();
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
    <Button
      v-else-if="insufficientBalance"
      size="lg"
      disabled
      variant="secondary"
    >
      残高不足 (必要: 🪙{{ bidPointCost.toLocaleString() }})
    </Button>
    <Button v-else size="lg" :disabled="disabled" @click="onClick">
      +¥{{ bidIncrement.toLocaleString() }}で入札 <br />(🪙{{
        bidPointCost.toLocaleString()
      }}消費)
    </Button>
    <p
      v-if="insufficientBalance"
      class="text-xs text-destructive flex items-center gap-1"
    >
      残高: 🪙{{ pointsBalanceStore.balance?.toLocaleString() }} / 必要: 🪙{{
        bidPointCost.toLocaleString()
      }}
    </p>
  </div>
</template>
