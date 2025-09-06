import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  PointPlanDto,
  DepositResponse,
  PurchasePointsResponse,
} from "@/api/points";

export const usePointsPurchaseStore = defineStore("pointsPurchase", () => {
  const selectedPlan = ref<PointPlanDto | null>(null);
  const purchasedPlan = ref<PointPlanDto | null>(null);

  const deposit = ref<DepositResponse | null>(null);
  const purchaseResult = ref<PurchasePointsResponse | null>(null);

  function selectPlan(plan: PointPlanDto) {
    selectedPlan.value = plan;
    deposit.value = null;
    purchaseResult.value = null;
  }

  function clearSelection() {
    selectedPlan.value = null;
  }

  function setDeposit(d: DepositResponse) {
    deposit.value = d;
  }

  function setPurchaseResult(r: PurchasePointsResponse) {
    purchaseResult.value = r;
    purchasedPlan.value = selectedPlan.value;
  }

  function resetAll() {
    selectedPlan.value = null;
    purchasedPlan.value = null;
    deposit.value = null;
    purchaseResult.value = null;
  }

  const hasSelection = computed(() => !!selectedPlan.value);

  return {
    selectedPlan,
    purchasedPlan,
    hasSelection,
    selectPlan,
    clearSelection,
    setDeposit,
    setPurchaseResult,
    resetAll,
    deposit,
    purchaseResult,
  };
});
