import { AuctionStatus } from "@/api/auction";
import * as signalR from "@microsoft/signalr";

export type BidUpdateDto = {
  auctionItemId: number;
  currentPrice: number;
  endTime: string;
  bidTime: string;
  bidId: number;
  currentHighestBidUserId: number;
  currentHighestBidUserName: string;
};

type Handler = (u: BidUpdateDto) => void;
export type AuctionClosedDto = {
  auctionItemId: number;
  finalPrice: number;
  endTime: string;
  status: AuctionStatus;
  winnerUserId: number;
};
type ClosedHandler = (c: AuctionClosedDto) => void;

class AuctionHubClient {
  private connection: signalR.HubConnection | null = null;
  private handlers = new Set<Handler>();
  private closedHandlers = new Set<ClosedHandler>();
  private joined = new Set<number>();
  private stateListeners = new Set<
    (state: "connected" | "disconnected" | "reconnecting") => void
  >();

  onStateChange(
    cb: (state: "connected" | "disconnected" | "reconnecting") => void
  ) {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  private notify(state: "connected" | "disconnected" | "reconnecting") {
    for (const l of this.stateListeners) l(state);
  }

  private buildBaseUrl() {
    const base = import.meta.env.VITE_API_BASE_URL || "";
    return base.replace(/\/api\/?$/, "");
  }

  async ensureConnected() {
    if (this.connection) {
      return;
    }
    const url = `${this.buildBaseUrl()}/auctionHub`;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on("ReceiveBidUpdate", (u: BidUpdateDto) => {
      for (const h of this.handlers) h(u);
    });

    this.connection.on("ReceiveAuctionClosed", (c: AuctionClosedDto) => {
      for (const h of this.closedHandlers) h(c);
    });

    this.connection.onreconnecting(() => {
      this.notify("reconnecting");
    });
    this.connection.onreconnected(() => {
      this.notify("connected");
    });
    this.connection.onclose(() => {
      this.notify("disconnected");
    });

    await this.connection.start();
    this.notify("connected");
    this.connection.onreconnected(async () => {
      if (!this.connection) return;
      const ids = Array.from(this.joined);
      if (ids.length) {
        try {
          await this.connection.invoke("SetVisibleItems", ids);
        } catch {}
      }
    });
  }

  onBidUpdate(handler: Handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  onAuctionClosed(handler: ClosedHandler) {
    this.closedHandlers.add(handler);
    return () => this.closedHandlers.delete(handler);
  }

  async subscribeItem(id: number) {
    await this.ensureConnected();
    if (!this.connection) return;
    await this.connection.invoke("SubscribeItem", id);
    this.joined.add(id);
  }

  async unsubscribeItem(id: number) {
    if (!this.connection) return;
    await this.connection.invoke("UnsubscribeItem", id);
    this.joined.delete(id);
  }

  async setVisibleItems(ids: number[]) {
    await this.ensureConnected();
    if (!this.connection) return;
    await this.connection.invoke("SetVisibleItems", ids);
    this.joined = new Set(ids);
  }

  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } finally {
        this.connection = null;
        this.joined.clear();
      }
    }
  }
}

export const auctionHub = new AuctionHubClient();
