export interface AuctionItem {
  id: number;
  thumbnailImageUrl: string;
  imageUrl: string;
  name: string;
  description: string;
  startingBid: number;
  currentBidUserId: string;
  currentBidUserName: string;
  currentBid: number;
  endTime: Date;
  status: "active" | "ended" | "preparing";
  bidHistory: BidHistoryItem[];
}

export interface BidHistoryItem {
  id: number;
  userId: string;
  userName: string;
  bidAmount: number;
  bidTime: Date;
}
