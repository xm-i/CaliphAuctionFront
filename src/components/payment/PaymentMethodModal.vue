<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import type { DepositResponse } from "@/api/points";
import PaypalPaymentForm from "./methods/PaypalPaymentForm.vue";
import CreditCardPaymentForm from "./methods/CreditCardPaymentForm.vue";
import BankTransferPaymentForm from "./methods/BankTransferPaymentForm.vue";

interface Props {
  amount: number; // 支払い金額
  open: boolean;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<{
  (e: "close"): void;
  (e: "completed", deposit: DepositResponse): void;
}>();

// UIステップ: method選択 or 各種フォーム
const step = ref<"select" | "paypal" | "card" | "bank">("select");

watch(
  () => props.open,
  (o) => {
    if (!o) {
      // Reset state when closed
      step.value = "select";
    }
  }
);

function backToSelect() {
  step.value = "select";
}
function handleCompleted(deposit: DepositResponse) {
  emit("completed", deposit);
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[200] flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-background/70 backdrop-blur-sm"
        @click="emit('close')"
      />
      <div
        class="relative w-full max-w-lg mx-auto rounded-lg border bg-card/90 backdrop-blur p-5 shadow-xl space-y-4 animate-in fade-in zoom-in"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-tight">決済方法の選択</h2>
          <Button
            v-if="step === 'select'"
            variant="link"
            class="text-xs px-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            @click="emit('close')"
            >閉じる</Button
          >
          <Button
            v-else
            variant="link"
            class="text-xs px-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            @click="backToSelect"
            >戻る</Button
          >
        </div>
        <div class="space-y-2">
          <slot />
        </div>

        <div v-if="step === 'select'" class="grid gap-3">
          <div class="text-xs text-muted-foreground">
            支払い方法を選択してください
          </div>
          <div class="grid sm:grid-cols-3 gap-3">
            <Button type="button" variant="secondary" @click="step = 'paypal'"
              >PayPal</Button
            >
            <Button type="button" variant="secondary" @click="step = 'card'"
              >クレジットカード</Button
            >
            <Button type="button" variant="secondary" @click="step = 'bank'"
              >銀行振込</Button
            >
          </div>
        </div>

        <template v-else>
          <div class="pt-1">
            <PaypalPaymentForm
              v-if="step === 'paypal'"
              :amount="amount"
              @completed="handleCompleted"
            />
            <CreditCardPaymentForm
              v-else-if="step === 'card'"
              :amount="amount"
              @completed="handleCompleted"
            />
            <BankTransferPaymentForm
              v-else-if="step === 'bank'"
              :amount="amount"
              @completed="handleCompleted"
            />
          </div>
        </template>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.animate-in.fade-in {
  animation: fadeIn 0.15s ease;
}
.animate-in.zoom-in {
  animation: zoomIn 0.2s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes zoomIn {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
</style>
