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
}
