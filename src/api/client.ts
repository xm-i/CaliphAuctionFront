import axios, { AxiosError } from "axios";
import { useTimeSyncStore } from "@/stores/timeSync";
import { useNotificationStore } from "@/stores/notifications";

let baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!baseURL) {
  if (typeof window !== "undefined") {
    console.warn(
      "[api] VITE_API_BASE_URL 未設定のため window.origin を使用します"
    );
    baseURL = window.location.origin;
  } else {
    baseURL = "http://localhost:3000";
  }
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }
  return config;
});

const ISO8601_REGEX =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

function reviveDates(input: unknown, inContainer = false): unknown {
  if (input == null) return input;
  if (typeof input === "string") {
    return inContainer && ISO8601_REGEX.test(input) ? new Date(input) : input;
  }
  if (Array.isArray(input)) {
    return input.map((v) => reviveDates(v, true));
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = reviveDates(v, true);
    }
    return out;
  }
  return input;
}

api.interceptors.response.use(
  (res) => {
    res.data = reviveDates(res.data, false);

    try {
      const store = useTimeSyncStore();
      const body = res.data as any;
      if (body && typeof body === "object" && body.serverTimeUtc) {
        const parsed = Date.parse(body.serverTimeUtc);
        if (Number.isFinite(parsed)) {
          const end = Date.now();
          const start = (res.config as any).__requestStart as
            | number
            | undefined;
          let rtt = 0;
          if (typeof start === "number" && end > start) {
            rtt = end - start;
          }
          // serverTimeUtc はサーバー生成時刻（概ねレスポンス生成時）なので RTT/2 補正を加算
          const adjusted = parsed + rtt / 2;
          const observedOffset = adjusted - end;
          store.updateOffset(observedOffset);
        }
      }
    } catch {}
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("auth_token");
      } catch {}
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      if (typeof window !== "undefined" && !path.startsWith("/signin")) {
        const full = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const redirect = encodeURIComponent(full || "/");
        window.location.assign(`/signin?redirect=${redirect}`);
      }
    }
    // Global error notification (4xx/5xx) except 401 already handled
    try {
      const cfg: any = error.config || {};
      const suppress = cfg.suppressGlobalError === true;
      if (!suppress && status && status >= 400) {
        const data: any = error.response?.data;
        const msg =
          (data && (data.error || data.message)) ||
          `エラーが発生しました (HTTP ${status})`;
        // Avoid flooding identical consecutive messages
        const store = useNotificationStore();
        const last = store.items
          .slice()
          .reverse()
          .find((i) => i.type === "error");
        if (!last || last.message !== msg) {
          store.push({ type: "error", message: msg, ttl: 8000 });
        }
      }
    } catch {}
    return Promise.reject(error);
  }
);

// Attach request start timestamp for RTT estimation
api.interceptors.request.use((config) => {
  (config as any).__requestStart = Date.now();
  return config;
});

export default api;
