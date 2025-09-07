<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { usePointsPurchaseStore } from "@/stores/pointsPurchase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createBankTransferDeposit, purchasePoints } from "@/api/points";

const router = useRouter();
const store = usePointsPurchaseStore();
const plan = computed(() => store.selectedPlan);

if (!plan.value) {
  router.replace({ name: "mypage-charge" });
}

interface BankInfo {
  name: string;
  branches: string[];
}
const banks: BankInfo[] = [
  {
    name: "どうぶつ銀行",
    branches: [
      "たぬき支店",
      "きつね支店",
      "うさぎ支店",
      "くま支店",
      "いぬ支店",
      "ねこ支店",
      "りす支店",
      "しか支店",
      "さる支店",
      "とり支店",
    ],
  },
  {
    name: "さかな銀行",
    branches: [
      "うなぎ支店",
      "めだか支店",
      "まぐろ支店",
      "たい支店",
      "さけ支店",
      "ふぐ支店",
      "こい支店",
      "かつお支店",
      "さんま支店",
      "いわし支店",
    ],
  },
  {
    name: "やさい銀行",
    branches: [
      "にんじん支店",
      "だいこん支店",
      "きゅうり支店",
      "かぼちゃ支店",
      "たまねぎ支店",
      "なす支店",
      "ごぼう支店",
      "れんこん支店",
      "キャベツ支店",
      "ブロッコリー支店",
    ],
  },
  {
    name: "くだもの銀行",
    branches: [
      "りんご支店",
      "みかん支店",
      "もも支店",
      "ぶどう支店",
      "バナナ支店",
      "いちご支店",
      "さくらんぼ支店",
      "パイナップル支店",
      "なし支店",
      "キウイ支店",
    ],
  },
  {
    name: "やま銀行",
    branches: [
      "ふじ支店",
      "たかお支店",
      "ろっこう支店",
      "くじゅう支店",
      "おんたけ支店",
      "ゆふ支店",
      "ひだか支店",
      "いぶき支店",
      "ひょうのう支店",
      "あそ支店",
    ],
  },
];

const bankName = ref<string>("");
const branchName = ref<string>("");
const accountNumber = ref("");
const accountHolder = ref("");

const availableBranches = computed(() => {
  const bank = banks.find((b) => b.name === bankName.value);
  return bank ? bank.branches : [];
});

watch(bankName, () => {
  // 銀行変更時に支店リセット
  if (!availableBranches.value.includes(branchName.value)) {
    branchName.value = "";
  }
});

const submitting = ref(false);
const error = ref<string | null>(null);

const canSubmit = computed(
  () =>
    !!plan.value &&
    bankName.value &&
    branchName.value &&
    accountNumber.value &&
    accountHolder.value &&
    !submitting.value
);

async function submit() {
  if (!canSubmit.value || !plan.value) return;
  submitting.value = true;
  error.value = null;
  try {
    const deposit = await createBankTransferDeposit({
      bankName: bankName.value,
      branchName: branchName.value,
      accountNumber: accountNumber.value,
      accountHolder: accountHolder.value,
      amount: plan.value.price,
    });
    store.setDeposit(deposit);
    const result = await purchasePoints({
      depositToken: deposit.depositToken,
      pointPlanId: plan.value.id,
    });
    store.setPurchaseResult(result);
    router.replace({ name: "points-complete" });
  } catch (e: any) {
    error.value = "エラーが発生しました";
  } finally {
    submitting.value = false;
  }
}

function cancel() {
  router.replace({ name: "points-method" });
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-background"
  >
    <header
      class="px-5 py-3 border-b bg-background/80 backdrop-blur flex items-center justify-between"
    >
      <h1 class="font-semibold tracking-tight">銀行振込</h1>
      <Button size="sm" variant="ghost" @click="cancel">戻る</Button>
    </header>
    <main class="flex-1 px-5 py-6">
      <div class="mx-auto max-w-md space-y-6">
        <Card v-if="plan" class="border-primary/40">
          <CardHeader class="pb-2"
            ><CardTitle class="text-base flex flex-col gap-1"
              ><span class="text-sm text-muted-foreground">選択中のプラン</span
              ><span class="text-lg font-bold">{{ plan.name }}</span></CardTitle
            ></CardHeader
          >
          <CardContent class="pt-0 text-sm space-y-1">
            <p>
              ポイント: <strong>{{ plan.points.toLocaleString() }}</strong> pt
            </p>
            <p>
              価格: <strong>\{{ plan.price.toLocaleString() }}</strong>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2"
            ><CardTitle class="text-base">振込情報</CardTitle></CardHeader
          >
          <CardContent class="pt-0 space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-medium">銀行名</label>
              <select
                v-model="bankName"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option disabled value="">選択してください</option>
                <option v-for="b in banks" :key="b.name" :value="b.name">
                  {{ b.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">支店名</label>
              <select
                v-model="branchName"
                :disabled="!bankName"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option disabled value="">
                  {{ bankName ? "支店を選択" : "先に銀行を選択" }}
                </option>
                <option v-for="br in availableBranches" :key="br" :value="br">
                  {{ br }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">口座番号</label
              ><input
                v-model="accountNumber"
                type="text"
                placeholder="0123456"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium">名義</label
              ><input
                v-model="accountHolder"
                type="text"
                placeholder="ナカモリ アキナ"
                class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
            <Button :disabled="!canSubmit" class="w-full" @click="submit">
              <span v-if="!submitting">振込を行う</span>
              <span v-else class="flex items-center gap-2"
                ><span
                  class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                ></span
                >処理中…</span
              >
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
