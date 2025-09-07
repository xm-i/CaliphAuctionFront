import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import type { LoginPayload } from "@/api/auth";

export function useAuth() {
  const store = useAuthStore();
  const { isAuthenticated, loading, error, user } = storeToRefs(store);
  const login = (payload: LoginPayload) => store.login(payload);
  const logout = () => store.logout();
  const updateAuthenticatedStatus = () => store.updateAuthenticatedStatus();
  store.ensureUserLoaded();
  return {
    isAuthenticated,
    loading,
    error,
    user,
    login,
    logout,
    updateAuthenticatedStatus,
    ensureUserLoaded: store.ensureUserLoaded,
  };
}
