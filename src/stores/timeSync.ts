import { defineStore } from "pinia";

/**
 * Time synchronization store
 * Maintains an estimated offset (serverTime - clientLocalTime)
 * so that components can compute an approximate server-based now.
 */
export const useTimeSyncStore = defineStore("timeSync", {
  state: () => ({
    // serverTime - clientLocalTime (ms). Positive means server ahead.
    offsetMs: 0 as number,
    // last updated timestamp (client now)
    lastUpdated: 0 as number,
    // how many samples collected
    samples: 0 as number,
  }),
  getters: {
    approxNow: (state) => {
      // Returns an approximation of server "now" in epoch ms.
      return Date.now() + state.offsetMs;
    },
  },
  actions: {
    /**
     * Update offset with a newly observed value.
     * Applies an exponential moving average to smooth jitter.
     * @param observedOffsetMs serverDateHeader - clientNow (adjusted by RTT/2)
     */
    updateOffset(observedOffsetMs: number) {
      const now = Date.now();
      if (!Number.isFinite(observedOffsetMs)) return;

      if (this.samples === 0) {
        this.offsetMs = observedOffsetMs;
      } else {
        // EMA smoothing factor (alpha). Tunable.
        const alpha = 0.2;
        this.offsetMs =
          this.offsetMs + alpha * (observedOffsetMs - this.offsetMs);
      }
      this.samples += 1;
      this.lastUpdated = now;
    },
    /** Force set offset (no smoothing) */
    setOffsetDirect(value: number) {
      if (!Number.isFinite(value)) return;
      this.offsetMs = value;
      this.lastUpdated = Date.now();
    },
  },
});
