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
