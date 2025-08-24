import api from "./client";

export type SearchItemDto = {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  currentPrice: number;
  endTime: string;
  categoryId: number;
  currentUserName: string | null;
};

type SearchResponse = {
  items: SearchItemDto[];
  totalCount: number;
};

export async function searchAuctions(): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/auction/search");
  return data;
}

// 詳細DTO・API
export type BidHistoryDto = {
  id: number;
  userId?: string;
  userName: string;
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
  endTime: Date;
  categoryId: number;
  categoryName: string;
  currentHighestBidUserName: string | null;
  bidCount: number;
  status: number;
  bidHistories: BidHistoryDto[];
};

export async function getAuctionItem(id: number): Promise<AuctionDetailDto> {
  const { data } = await api.get<AuctionDetailDto>(`/auction/items/${id}`);
  return data;
}
