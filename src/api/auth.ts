import api from "./client";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { accessToken: string };

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/users/login", payload);
  localStorage.setItem("auth_token", data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem("auth_token");
}
