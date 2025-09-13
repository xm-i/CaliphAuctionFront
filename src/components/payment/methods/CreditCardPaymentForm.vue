<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { createCreditCardDeposit, type DepositResponse } from "@/api/points";

interface Props {
  amount: number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "completed", deposit: DepositResponse): void;
}>();

const cardNumber = ref("");
const cardHolder = ref("");
const expiryMonth = ref("");
const expiryYear = ref("");
const cvv = ref("");
const submitting = ref(false);
const error = ref<string | null>(null);

const canSubmit = computed(
  () =>
    cardNumber.value.length >= 8 &&
    cardHolder.value &&
    expiryMonth.value &&
    expiryYear.value &&
    cvv.value &&
    !submitting.value
);

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = null;
  try {
    // artificial pre-submit delay (2s)
    await new Promise((r) => setTimeout(r, 2000));
    const deposit = await createCreditCardDeposit({
      cardNumber: cardNumber.value,
      cardHolder: cardHolder.value,
      expiryMonth: expiryMonth.value,
      expiryYear: expiryYear.value,
      cvv: cvv.value,
      amount: props.amount,
    });
    emit("completed", deposit);
  } catch (e: any) {
    error.value = "カード決済に失敗しました";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="text-sm font-medium">クレジットカード決済</div>
    <div
      class="text-[11px] rounded-md border border-blue-300/60 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 px-3 py-2 leading-relaxed flex gap-2"
    >
      <span class="mt-0.5 select-none">💳</span>
      <span>有効なカード番号は入力できません (バリデーション用)。</span>
    </div>
    <div class="space-y-4 text-sm">
      <div class="space-y-1">
        <label class="text-xs font-medium flex items-center justify-between">
          <span>カード番号</span>
          <span
            v-if="cardNumber && cardNumber.length <= 12"
            class="text-[10px] text-destructive"
            >桁数不足</span
          >
        </label>
        <input
          v-model="cardNumber"
          inputmode="numeric"
          autocomplete="cc-number"
          type="text"
          placeholder="4242 4242 4242 4242"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium">名義</label>
        <input
          v-model="cardHolder"
          type="text"
          placeholder="AKINA NAKAMORI"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="space-y-1 col-span-1">
          <label class="text-xs font-medium">月</label>
          <input
            v-model="expiryMonth"
            type="text"
            placeholder="10"
            class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="space-y-1 col-span-1">
          <label class="text-xs font-medium">年(YY)</label>
          <input
            v-model="expiryYear"
            type="text"
            placeholder="27"
            class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="space-y-1 col-span-1">
          <label class="text-xs font-medium">CVV</label>
          <input
            v-model="cvv"
            type="text"
            placeholder="123"
            class="w-full rounded-md border bg-background/70 backdrop-blur px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
    <Button :disabled="!canSubmit" class="w-full" @click="submit">
      <span v-if="!submitting">カードで支払う</span>
      <span v-else class="flex items-center gap-2"
        ><span
          class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
        ></span
        >処理中...</span
      >
    </Button>
  </div>
</template>
