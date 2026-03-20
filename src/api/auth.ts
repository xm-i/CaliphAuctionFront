import api from "./client";

export type LoginPayload = {
  userId?: string;
  email?: string;
  password: string;
};
export type User = {
  id: number;
  email: string;
  username: string;
  isPreRegistered?: boolean;
};
export type LoginResponse = { accessToken: string; user: User };

export type PreRegisterPayload = { username: string };
export type PreRegisterResponse = { userId: string; password: string };

export async function preRegister(
  payload: PreRegisterPayload,
): Promise<PreRegisterResponse> {
  const { data } = await api.post<PreRegisterResponse>(
    "/users/pre-register",
    payload,
  );
  return data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/users/login", payload);
  localStorage.setItem("auth_token", data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export type RegisterPayload = {
  email: string;
  password: string;
};
export type RegisterResponse = { accessToken: string };

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/users/register", payload);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}
