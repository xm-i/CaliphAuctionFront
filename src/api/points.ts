import api from "./client";

export interface PointPlanDto {
  id: number;
  name: string;
  points: number;
  price: number;
}

export async function getPointPlans(): Promise<PointPlanDto[]> {
  const { data } = await api.get<PointPlanDto[]>("/points/plans");
  return data;
}

export interface PaypalDepositRequest {
  loginId: string;
  password: string;
  amount: number;
}

export interface DepositResponse {
  depositToken: string;
  amount: number;
  provider: string;
  expiresAtUtc: string;
}

export async function createPaypalDeposit(
  payload: PaypalDepositRequest
): Promise<DepositResponse> {
  const { data } = await api.post<DepositResponse>("/external/paypal/deposit", {
    loginId: payload.loginId,
    password: payload.password,
    Amount: payload.amount,
  });
  return data;
}

export interface PurchasePointsRequest {
  depositToken: string;
  pointPlanId: number;
}

export interface PurchasePointsResponse {
  addedPoints: number;
  newBalance: number;
}

export async function purchasePoints(
  payload: PurchasePointsRequest
): Promise<PurchasePointsResponse> {
  const { data } = await api.post<PurchasePointsResponse>("/points/purchase", {
    depositToken: payload.depositToken,
    pointPlanId: payload.pointPlanId,
  });
  return data;
}
