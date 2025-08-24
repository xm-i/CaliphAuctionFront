import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  }
);

export default api;
