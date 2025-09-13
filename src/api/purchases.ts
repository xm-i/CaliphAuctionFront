import api from "./client";

export interface PurchaseStatusDto {
  auctionItemId: number;
  purchased: boolean;
  deliveryDate: string | null;
  deliveryTimeSlot: number | null;
  shippingCarrier: number | null;
  prefecture: string | null;
  city: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
}

export interface CreatePurchaseRequest {
  auctionId: number;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  deliveryDate: string;
  deliveryTimeSlot: number;
  shippingCarrier: number;
  depositToken: string;
}

export async function getPurchaseStatus(
  auctionItemId: number
): Promise<PurchaseStatusDto> {
  const { data } = await api.get<PurchaseStatusDto>(
    `/purchases/status/${auctionItemId}`
  );
  return data;
}

export async function createPurchase(
  payload: CreatePurchaseRequest
): Promise<void> {
  await api.post("/purchases/won", payload);
}
