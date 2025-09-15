import { defineStore } from "pinia";

export interface AppNotification {
  id: number;
  type: "error" | "info" | "success" | "warning";
  message: string;
  createdAt: number;
  ttl?: number; // ms
}

let counter = 0;

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    items: [] as AppNotification[],
  }),
  actions: {
    push(
      partial: Omit<AppNotification, "id" | "createdAt"> & { ttl?: number }
    ) {
      const item: AppNotification = {
        id: ++counter,
        createdAt: Date.now(),
        ttl: partial.ttl ?? 8000,
        type: partial.type,
        message: partial.message,
      };
      this.items.push(item);
      return item.id;
    },
    remove(id: number) {
      this.items = this.items.filter((i) => i.id !== id);
    },
    pruneExpired() {
      const now = Date.now();
      this.items = this.items.filter(
        (i) => !i.ttl || now - i.createdAt < i.ttl
      );
    },
  },
});
