import { ref, computed } from "vue";
import { login as loginApi, type LoginPayload } from "@/api/auth";

const authedRef = ref<boolean>(!!localStorage.getItem("auth_token"));

const loadingRef = ref(false);
const errorRef = ref<string | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => authedRef.value);

  const login = async (payload: LoginPayload) => {
    loadingRef.value = true;
    errorRef.value = null;
    try {
      const res = await loginApi(payload);
      authedRef.value = true;
      return res.accessToken;
    } catch (e: any) {
      errorRef.value = "ログインに失敗しました";
      throw e;
    } finally {
      loadingRef.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    authedRef.value = false;
    errorRef.value = null;
  };

  return {
    isAuthenticated,
    loading: loadingRef,
    error: errorRef,
    login,
    logout,
  };
}
