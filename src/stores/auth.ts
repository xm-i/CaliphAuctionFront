import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login as loginApi, type LoginPayload, type User } from "@/api/auth";
import { isJwtValid } from "@/lib/jwt";

export const useAuthStore = defineStore("auth", () => {
  const authed = ref<boolean>(!!localStorage.getItem("auth_token"));
  const loading = ref(false);
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => authed.value);

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await loginApi(payload);
      authed.value = isJwtValid(res.accessToken);
      user.value = res.user;
      return res.accessToken;
    } catch (e: any) {
      error.value = "ログインに失敗しました";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem("auth_token");
    authed.value = false;
    user.value = null;
    error.value = null;
  }

  function updateAuthenticatedStatus() {
    const token = localStorage.getItem("auth_token") || "";
    const valid = isJwtValid(token);
    authed.value = valid;
    if (!valid) {
      localStorage.removeItem("auth_token");
      user.value = null;
    }
  }

  (function initFromToken() {
    updateAuthenticatedStatus();
  })();

  return {
    isAuthenticated,
    loading,
    error,
    user,
    login,
    logout,
    updateAuthenticatedStatus,
  };
});
