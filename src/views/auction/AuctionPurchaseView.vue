<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getPurchaseStatus,
  createPurchase,
  type PurchaseStatusDto,
  type CreatePurchaseRequest,
} from "@/api/purchases";
import { getAuctionItem } from "@/api/auction";
import { useAuth } from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import PaymentMethodModal from "@/components/payment/PaymentMethodModal.vue";
import type { DepositResponse } from "@/api/points";
import { Separator } from "@/components/ui/separator";

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();
const auctionId = Number(route.params.id);

const loading = ref(true);
const submitting = ref(false);
// 決済完了後の購入API処理中表示用
const purchasing = ref(false);
const status = ref<PurchaseStatusDto | null>(null);
const auction = ref<any | null>(null);
const error = ref<string | null>(null);

// form fields
const prefecture = ref("");
const city = ref("");
const addressLine1 = ref("");
const addressLine2 = ref("");
const deliveryDate = ref("");
const deliveryTimeSlot = ref<number | null>(null);
const shippingCarrier = ref<number | null>(null);

// 配送日選択範囲 (今日から14日間)
function formatDate(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
const today = new Date();
const minDeliveryDate = formatDate(today);
const maxDeliveryDate = formatDate(
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)
);

// 選択肢
interface Option {
  label: string;
  value: number;
}
const timeSlotOptions: Option[] = [
  { label: "08:00 - 10:00", value: 1 },
  { label: "10:00 - 12:00", value: 2 },
  { label: "12:00 - 14:00", value: 3 },
  { label: "14:00 - 16:00", value: 4 },
  { label: "16:00 - 18:00", value: 5 },
  { label: "18:00 - 20:00", value: 6 },
  { label: "19:00 - 21:00", value: 7 },
];
const carrierOptions: Option[] = [
  { label: "シロネコ便", value: 1 },
  { label: "ペリカン急便", value: 2 },
  { label: "カモメエクスプレス", value: 3 },
  { label: "ラビット宅配", value: 4 },
  { label: "ツバメ航空陸送", value: 5 },
];

function timeSlotLabel(code: number) {
  // コードは常に正しい前提
  return timeSlotOptions.find((o) => o.value === code)!.label;
}
function carrierLabel(code: number) {
  return carrierOptions.find((o) => o.value === code)!.label;
}
const depositToken = ref(""); // 決済モーダル完了後にセット
const showPaymentModal = ref(false);

const purchased = computed(() => status.value?.purchased);

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.replace({ name: "signin", query: { redirect: route.fullPath } });
    return;
  }
  try {
    const [a, s] = await Promise.all([
      getAuctionItem(auctionId),
      getPurchaseStatus(auctionId),
    ]);
    auction.value = a;
    status.value = s;
    if (s.purchased) {
      // prefill
      prefecture.value = s.prefecture || "";
      city.value = s.city || "";
      addressLine1.value = s.addressLine1 || "";
      addressLine2.value = s.addressLine2 || "";
      deliveryDate.value = s.deliveryDate || "";
      deliveryTimeSlot.value = s.deliveryTimeSlot;
      shippingCarrier.value = s.shippingCarrier;
      // 範囲外なら丸め込み（過去 → min、遠すぎる未来 → max）
      if (deliveryDate.value) {
        if (deliveryDate.value < minDeliveryDate)
          deliveryDate.value = minDeliveryDate;
        if (deliveryDate.value > maxDeliveryDate)
          deliveryDate.value = maxDeliveryDate;
      }
    }
  } catch (e: any) {
    error.value = "購入情報の取得に失敗しました";
  } finally {
    loading.value = false;
  }
});

// 入力が完了していて決済未実施の状態で"購入"ボタン活性
const canOpenPayment = computed(
  () =>
    !purchased.value &&
    prefecture.value &&
    city.value &&
    addressLine1.value &&
    deliveryDate.value &&
    deliveryTimeSlot.value != null &&
    shippingCarrier.value != null &&
    !submitting.value
);

async function refreshStatus() {
  try {
    status.value = await getPurchaseStatus(auctionId);
  } catch (e: any) {
    // ignore for silent refresh
  }
}

function openPaymentModal() {
  if (!canOpenPayment.value) return;
  showPaymentModal.value = true;
}

async function onPaymentCompleted(deposit: DepositResponse) {
  // 決済完了後 -> 2秒間のローディングを挟んでから購入API呼び出し
  depositToken.value = deposit.depositToken;
  showPaymentModal.value = false;
  submitting.value = true;
  purchasing.value = true;
  error.value = null;
  try {
    await new Promise((r) => setTimeout(r, 2000));
    const payload: CreatePurchaseRequest = {
      auctionId,
      prefecture: prefecture.value,
      city: city.value,
      addressLine1: addressLine1.value,
      addressLine2: addressLine2.value || "",
      deliveryDate: deliveryDate.value,
      deliveryTimeSlot: deliveryTimeSlot.value!,
      shippingCarrier: shippingCarrier.value!,
      depositToken: deposit.depositToken,
    };
    await createPurchase(payload);
    router.replace({
      name: "auction-purchase-complete",
      params: { id: auctionId },
    });
  } catch (e: any) {
    error.value = "購入処理に失敗しました";
    await refreshStatus();
  } finally {
    submitting.value = false;
    purchasing.value = false;
  }
}

async function onPaymentModalClosed() {
  showPaymentModal.value = false;
  // モーダルクローズ後に最新状況を取得
  await refreshStatus();
}
</script>

<template>
  <div class="relative max-w-3xl mx-auto p-6 space-y-8">
    <div v-if="loading" class="space-y-4">
      <div class="h-7 w-40 bg-muted/40 rounded animate-pulse" />
      <div class="h-40 bg-muted/30 rounded animate-pulse" />
    </div>
    <template v-else>
      <h1 class="text-2xl font-semibold tracking-tight flex items-center gap-2">
        落札商品購入
        <span v-if="auction" class="text-sm text-muted-foreground"
          >#{{ auction.id }} {{ auction.name }}</span
        >
      </h1>
      <div v-if="error" class="text-sm text-destructive">{{ error }}</div>
      <Separator />

      <div v-if="purchased" class="space-y-4 bg-card/60 p-4 rounded-lg border">
        <h2 class="text-base font-semibold">購入済み情報</h2>
        <ul class="text-sm grid grid-cols-2 gap-y-1 gap-x-4">
          <li>
            <span class="text-muted-foreground/70">配送業者:</span>
            {{ carrierLabel(status!.shippingCarrier!) }}
          </li>
          <li>
            <span class="text-muted-foreground/70">お届け日:</span>
            {{ status!.deliveryDate }}
          </li>
          <li>
            <span class="text-muted-foreground/70">時間帯:</span>
            {{ timeSlotLabel(status!.deliveryTimeSlot!) }}
          </li>
          <li class="col-span-2">
            <span class="text-muted-foreground/70">お届け先:</span>
            {{ status!.prefecture }} {{ status!.city }}
            {{ status!.addressLine1 }} {{ status!.addressLine2 }}
          </li>
        </ul>
        <div class="pt-2">
          <Button
            size="sm"
            variant="secondary"
            @click="
              () =>
                router.replace({
                  name: 'auction-detail',
                  params: { id: auctionId },
                })
            "
            >戻る</Button
          >
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="bg-card/60 p-4 rounded-lg border space-y-4">
          <h2 class="text-base font-semibold">配送先情報</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block text-xs font-medium mb-1">都道府県</label>
              <input
                v-model="prefecture"
                type="text"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">市区町村</label>
              <input
                v-model="city"
                type="text"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium mb-1">住所１</label>
              <input
                v-model="addressLine1"
                type="text"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium mb-1"
                >住所２ (任意)</label
              >
              <input
                v-model="addressLine2"
                type="text"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">お届け日</label>
              <input
                v-model="deliveryDate"
                type="date"
                :min="minDeliveryDate"
                :max="maxDeliveryDate"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <p class="mt-1 text-[11px] text-muted-foreground">
                選択可能期間: {{ minDeliveryDate }} 〜 {{ maxDeliveryDate }}
              </p>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">時間帯コード</label>
              <select
                v-model.number="deliveryTimeSlot"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option disabled value="">選択してください</option>
                <option
                  v-for="opt in timeSlotOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1"
                >配送業者コード</label
              >
              <select
                v-model.number="shippingCarrier"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option disabled value="">選択してください</option>
                <option
                  v-for="opt in carrierOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button
            :disabled="!canOpenPayment"
            @click="openPaymentModal"
            class="min-w-40"
          >
            <span v-if="!submitting">決済方法を選択して購入</span>
            <span v-else class="flex items-center gap-2">
              <span class="animate-spin">⟳</span> 実行中...
            </span>
          </Button>
          <Button
            variant="secondary"
            @click="
              () =>
                router.replace({
                  name: 'auction-detail',
                  params: { id: auctionId },
                })
            "
            >戻る</Button
          >
        </div>
      </div>
    </template>
  </div>
  <PaymentMethodModal
    :open="showPaymentModal"
    :amount="auction?.currentPrice || 0"
    title="支払い方法の選択"
    purpose="purchase"
    @close="onPaymentModalClosed"
    @completed="onPaymentCompleted"
  >
    <div
      v-if="auction"
      class="rounded-md border bg-background/60 backdrop-blur px-3 py-2 text-[11px] leading-relaxed space-y-1"
    >
      <div class="flex items-center justify-between text-xs font-medium">
        <span class="truncate max-w-[60%]" :title="auction.name"
          >#{{ auction.id }} {{ auction.name }}</span
        >
        <span class="tabular-nums"
          >落札価格: ￥{{ (auction.currentPrice || 0).toLocaleString() }}</span
        >
      </div>
    </div>
  </PaymentMethodModal>
  <!-- Purchasing overlay -->
  <div
    v-if="purchasing"
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
  >
    <div
      class="flex flex-col items-center gap-4 px-6 py-8 rounded-lg border bg-card/70 shadow-lg"
    >
      <span
        class="inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
      ></span>
      <div class="flex flex-col items-center gap-1">
        <p class="text-sm font-medium tracking-tight">購入処理中...</p>
        <p class="text-[11px] text-muted-foreground">
          しばらくそのままでお待ちください
        </p>
      </div>
    </div>
  </div>
</template>
