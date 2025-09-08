<template>
  <section
    class="relative group flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background/90 to-background/95 md:shadow-xl backdrop-blur-sm"
    aria-label="ユーザーレビュー"
  >
    <header class="w-full px-6 pt-6 z-10">
      <h2
        class="text-base font-semibold tracking-tight flex items-center gap-2"
      >
        <span class="inline-block h-4 w-1.5 rounded bg-primary/70"></span>
        ユーザーレビュー
      </h2>
      <p class="mt-1 text-xs text-muted-foreground">
        実際にご利用いただいたユーザーの声（一部抜粋）
      </p>
    </header>

    <div class="relative w-full flex flex-col gap-6 py-6 md:py-8 h-[180px]">
      <Marquee class="[--duration:var(--marquee-duration,66s)]">
        <ReviewCard
          v-for="review in reviews"
          :key="review.name + review.age"
          :name="review.name"
          :age="review.age"
          :gender="review.gender"
          :body="review.body"
        />
      </Marquee>
      <!-- Side fade overlays -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-background via-background/70 to-transparent dark:from-background z-10"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-background via-background/70 to-transparent dark:from-background z-10"
        aria-hidden="true"
      ></div>

      <!-- Subtle overlay highlight -->
      <div
        class="pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 h-2/3 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        aria-hidden="true"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ReviewCard from "./ui/marquee/ReviewCard.vue";
import Marquee from "./ui/marquee/Marquee.vue";

interface ReviewItem {
  name: string;
  age: number;
  gender: string; // 男性 / 女性 / その他
  body: string;
}

const reviews: ReviewItem[] = [
  {
    name: "Sniper猫",
    age: 29,
    gender: "男性",
    body: "少ないポイントで入札できるのでスリルがあって楽しい。終了直前の駆け引きが最高です。",
  },
  {
    name: "深夜オークション勢",
    age: 34,
    gender: "女性",
    body: "UI がシンプルで直感的。初回でもすぐ理解できました。夜の盛り上がりがすごい。",
  },
  {
    name: "pointSaver",
    age: 41,
    gender: "男性",
    body: "通知のおかげで他の作業をしながらでもチャンスを逃さない。細かい改善が続いているのも好印象。",
  },
  {
    name: "終盤マスター",
    age: 26,
    gender: "女性",
    body: "終了間際の緊張感がクセになります。想像より安く落札できて満足。",
  },
  {
    name: "静かなる競り手",
    age: 37,
    gender: "男性",
    body: "履歴が見やすくて振り返りしやすい。ポイント残高の反映も速い。",
  },
  {
    name: "一発逆転マン",
    age: 31,
    gender: "男性",
    body: "スマホでもサクサク動く。今後カテゴリがもっと増えると嬉しいです。",
  },
  {
    name: "節約ハンター",
    age: 45,
    gender: "女性",
    body: "疑問点を問い合わせたらすぐ返答が来て安心できました。サポート体制が良い。",
  },
  {
    name: "夜ふかし入札部",
    age: 23,
    gender: "男性",
    body: "入札テンポが程よくて集中しすぎないのが良い。BGM 機能とか欲しいかも。",
  },
  {
    name: "粘りのカメ",
    age: 38,
    gender: "男性",
    body: "落札後の流れがスムーズでストレスなし。配送状況も追跡できるとさらに嬉しい。",
  },
  {
    name: "ラスト3秒侍",
    age: 32,
    gender: "女性",
    body: "ポイントチャージが簡単で決済方法も豊富。深夜帯のイベントが面白い。",
  },
];
</script>
