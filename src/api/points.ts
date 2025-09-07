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

// --- Bank Transfer ---
export interface BankTransferDepositRequest {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
}

export async function createBankTransferDeposit(
  payload: BankTransferDepositRequest
): Promise<DepositResponse> {
  const { data } = await api.post<DepositResponse>(
    "/external/bank-transfer/deposit",
    {
      bankName: payload.bankName,
      branchName: payload.branchName,
      accountNumber: payload.accountNumber,
      accountHolder: payload.accountHolder,
      Amount: payload.amount,
    }
  );
  return data;
}

// --- Credit Card ---
export interface CreditCardDepositRequest {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string; // "01"-"12"
  expiryYear: string; // YY format
  cvv: string;
  amount: number;
}

export async function createCreditCardDeposit(
  payload: CreditCardDepositRequest
): Promise<DepositResponse> {
  const { data } = await api.post<DepositResponse>(
    "/external/credit-card/deposit",
    {
      cardNumber: payload.cardNumber,
      cardHolder: payload.cardHolder,
      expiryMonth: payload.expiryMonth,
      expiryYear: payload.expiryYear,
      cvv: payload.cvv,
      Amount: payload.amount,
    }
  );
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
