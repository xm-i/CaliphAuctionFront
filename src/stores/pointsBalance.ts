import { defineStore } from "pinia";
import { ref } from "vue";
import { getMeSummary } from "@/api/me";
import { useAuth } from "@/composables/useAuth";

export const usePointsBalanceStore = defineStore("pointsBalance", () => {
  const balance = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // 自動ポーリングは行わず、明示トリガーのみ

  async function updateBalanceFromApi() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated.value) {
      balance.value = null;
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const data = await getMeSummary();
      balance.value = data.pointBalance;
    } catch (e: any) {
      error.value = "残高取得失敗";
    } finally {
      loading.value = false;
    }
  }
  function setBalance(v: number | null) {
    balance.value = v;
  }

  return { balance, loading, error, updateBalanceFromApi, setBalance };
});
