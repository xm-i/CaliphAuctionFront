<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { createPaypalDeposit, type DepositResponse } from "@/api/points";

interface Props {
  amount: number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "completed", deposit: DepositResponse): void;
}>();

const email = ref("");
const password = ref("");
const submitting = ref(false);
const error = ref<string | null>(null);

const canSubmit = computed(
  () => email.value && password.value && !submitting.value
);

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = null;
  try {
    // artificial pre-submit delay (2s)
    await new Promise((r) => setTimeout(r, 2000));
    const deposit = await createPaypalDeposit({
      loginId: email.value,
      password: password.value,
      amount: props.amount,
    });
    emit("completed", deposit);
  } catch (e: any) {
    error.value = "PayPal決済に失敗しました";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="text-sm font-medium">PayPal 決済</div>
    <div
      class="text-[11px] rounded-md border border-amber-300/60 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-3 py-2 leading-relaxed flex gap-2"
    >
      <span class="mt-0.5 inline-block select-none">☑️</span>
      <span>実在のID/パスワードを入力しないでください。</span>
    </div>
    <div class="space-y-2 text-sm">
      <div>
        <label class="block text-xs font-medium mb-1"
          >ログインID (メール)</label
        >
        <input
          v-model="email"
          type="text"
          placeholder="auction@example.com"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label class="block text-xs font-medium mb-1">パスワード</label>
        <input
          v-model="password"
          type="text"
          placeholder="password"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
    <Button :disabled="!canSubmit" class="w-full" @click="submit">
      <span v-if="!submitting">PayPalで支払う</span>
      <span v-else class="flex items-center gap-2"
        ><span
          class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
        ></span
        >処理中...</span
      >
    </Button>
  </div>
</template>
