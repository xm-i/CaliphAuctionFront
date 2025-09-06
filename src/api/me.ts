import api from "./client";
import type { SearchResponse } from "./auction";

export interface NotificationDto {
  id: number;
  category: string | null;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface MeSummaryResponse {
  pointBalance: number;
  totalSpentAmount: number;
  notifications: NotificationDto[];
}

export async function getMeSummary(): Promise<MeSummaryResponse> {
  const { data } = await api.get<MeSummaryResponse>("/me/summary");
  return data;
}

export async function getWonItems(
  limit: number | null = null
): Promise<SearchResponse> {
  var url = "/me/won-items";
  if (limit != null) {
    url += `?limit=${limit}`;
  }
  const { data } = await api.get<SearchResponse>(url);
  return data;
}

export async function getBiddingItems(
  limit: number | null = null
): Promise<SearchResponse> {
  var url = "/me/bidding-items";
  if (limit != null) {
    url += `?limit=${limit}`;
  }
  const { data } = await api.get<SearchResponse>(url);
  return data;
}
