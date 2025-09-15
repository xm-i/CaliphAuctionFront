<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { createBankTransferDeposit, type DepositResponse } from "@/api/points";

interface Props {
  amount: number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "completed", deposit: DepositResponse): void;
}>();

const bankName = ref("");
const branchName = ref("");
const accountNumber = ref("");
const accountHolder = ref("");
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
const availableBranches = computed(
  () => banks.find((b) => b.name === bankName.value)?.branches || []
);
const submitting = ref(false);
const error = ref<string | null>(null);

const canSubmit = computed(
  () =>
    bankName.value &&
    branchName.value &&
    accountNumber.value &&
    accountHolder.value &&
    !submitting.value
);

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  error.value = null;
  try {
    // artificial pre-submit delay (2s)
    await new Promise((r) => setTimeout(r, 2000));
    const deposit = await createBankTransferDeposit({
      bankName: bankName.value,
      branchName: branchName.value,
      accountNumber: accountNumber.value,
      accountHolder: accountHolder.value,
      amount: props.amount,
    });
    emit("completed", deposit);
  } catch (e: any) {
    error.value = "銀行振込登録に失敗しました";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="text-sm font-medium">銀行振込</div>
    <div class="space-y-4 text-sm">
      <div class="space-y-1">
        <label class="text-xs font-medium">銀行名</label>
        <Select v-model="bankName">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent class="z-[9999]">
            <SelectGroup>
              <SelectItem v-for="b in banks" :key="b.name" :value="b.name">
                {{ b.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium">支店名</label>
        <Select v-model="branchName" :disabled="!bankName">
          <SelectTrigger class="w-full">
            <SelectValue
              :placeholder="bankName ? '支店を選択' : '先に銀行を選択'"
            />
          </SelectTrigger>
          <SelectContent class="z-[9999]">
            <SelectGroup>
              <SelectItem v-for="br in availableBranches" :key="br" :value="br">
                {{ br }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium">口座番号</label>
        <input
          v-model="accountNumber"
          type="text"
          placeholder="0123456"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium">名義</label>
        <input
          v-model="accountHolder"
          type="text"
          placeholder="ナカモリ アキナ"
          class="w-full rounded-md border bg-background/70 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
    <p class="text-[11px] text-muted-foreground leading-relaxed">
      振込方式の場合、即時反映されない場合があります。
    </p>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
    <Button :disabled="!canSubmit" class="w-full" @click="submit">
      <span v-if="!submitting">振込を登録</span>
      <span v-else class="flex items-center gap-2"
        ><span
          class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
        ></span
        >処理中...</span
      >
    </Button>
  </div>
</template>
