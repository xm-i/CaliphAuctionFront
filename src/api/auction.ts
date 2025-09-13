import api from "./client";

export enum AuctionStatus {
  Preparing = 0,
  Active = 1,
  Ended = 2,
}

export type SearchItemDto = {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  currentPrice: number;
  bidIncrement: number;
  bidPointCost: number;
  endTime: Date;
  categoryId: number;
  status: AuctionStatus;
  currentHighestBidUserName: string | null;
  currentHighestBidUserId: number | null;
  purchased?: boolean;
};

export type SearchResponse = {
  items: SearchItemDto[];
  totalCount: number;
};

export type SearchAuctionParams = {
  categoryId?: number;
};

export async function searchAuctions(
  params?: SearchAuctionParams
): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/auction/search", {
    params,
  });
  return data;
}

// 詳細DTO・API
export type BidHistoryDto = {
  id: number;
  userId?: string;
  username: string;
  bidAmount: number;
  bidTime: Date;
};

export type AuctionDetailDto = {
  id: number;
  name: string;
  description: string;
  thumbnailImageUrl: string;
  imageUrl: string;
  originalPrice: number;
  startingBid: number;
  currentPrice: number;
  bidIncrement: number;
  bidPointCost: number;
  endTime: Date;
  categoryId: number;
  categoryName: string;
  currentHighestBidUserName: string | null;
  currentHighestBidUserId: number | null;
  bidCount: number;
  status: AuctionStatus;
  bidHistories: BidHistoryDto[];
};

export async function getAuctionItem(id: number): Promise<AuctionDetailDto> {
  const { data } = await api.get<AuctionDetailDto>(`/auction/items/${id}`);
  return data;
}

// 入札API
export type PlaceBidPayload = {
  auctionItemId: number;
  bidAmount: number;
};

export async function placeBid(payload: PlaceBidPayload): Promise<void> {
  await api.post("/auction/place-bid", payload);
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  activeItemCount: number;
}

// Simple in-memory cache (lives for the lifetime of the tab)
let _categoriesCache: CategoryDto[] | null = null;

export async function getCategories(options?: {
  force?: boolean;
}): Promise<CategoryDto[]> {
  if (!options?.force && _categoriesCache) return _categoriesCache;
  const { data } = await api.get<CategoryDto[]>("/auction/categories");
  _categoriesCache = data;
  return data;
}

export function clearCategoriesCache() {
  _categoriesCache = null;
}
