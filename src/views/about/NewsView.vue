<script setup lang="ts">
// お知らせページ（簡易一覧仮）
import { ref } from "vue";
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
interface NewsItem {
  id: number;
  date: string;
  title: string;
  body: string;
}
const news = ref<NewsItem[]>([
  {
    id: 1,
    date: "2025-09-01",
    title: "新機能: リアルタイム通知改善",
    body: "入札通知のレイテンシを平均30%削減しました。",
  },
  {
    id: 2,
    date: "2025-08-20",
    title: "メンテナンス完了",
    body: "深夜メンテナンスは予定通り完了しました。",
  },
]);
</script>
<template>
  <AboutLayout
    title="お知らせ"
    :enable-toc="true"
    description="機能追加や仕様変更、計画メンテ、インシデント報告など運用上重要な更新を時系列で公開します。透明性向上のため分類・影響範囲・検知方法・復旧時間を可能な限り明示します。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10"
    >
      <AboutSection title="公開ポリシー">
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>
            <span class="font-medium">分類タグ:</span> feature / maintenance /
            incident / improvement / notice
          </li>
          <li>
            <span class="font-medium">重大度基準:</span>
            影響ユーザー割合・継続時間・データ完全性
          </li>
          <li>
            <span class="font-medium">インシデント初報目標:</span> 検知後 60
            分以内（暫定）
          </li>
          <li>
            <span class="font-medium">再発防止策:</span> 7
            営業日以内に最終報告エントリ追加
          </li>
        </ul>
      </AboutSection>
      <AboutSection title="最近の更新">
        <ul class="divide-y border rounded-md bg-card/50">
          <li
            v-for="n in news"
            :key="n.id"
            class="p-4 space-y-1 hover:bg-muted/40"
          >
            <div class="text-xs text-muted-foreground">{{ n.date }}</div>
            <h3 class="font-semibold">{{ n.title }}</h3>
            <p class="text-sm leading-relaxed">{{ n.body }}</p>
          </li>
        </ul>
        <p class="text-xs text-muted-foreground mt-2">
          ※ ベータ期間中は変更が頻繁です。重要 API 仕様変更は最低 2
          週間前告知を目標とします。
        </p>
      </AboutSection>
      <AboutSection title="アーカイブと検索">
        <p class="text-sm leading-relaxed">
          30
          日以上前のお知らせは別エンドポイント（予定）へアーカイブ。タグフィルタ
          /
          全文検索を提供し過去障害対応履歴を公開、信頼性評価に資する情報資産とします。統計生成用に
          JSON / CSV エクスポート API も計画。
        </p>
      </AboutSection>
      <AboutSection title="改善ロードマップ（抜粋）">
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>Q4: 入札リプレイ & 時系列ヒートマップ + ログ追跡 UI</li>
          <li>Q4: 監査用ハッシュ署名付き落札履歴エクスポート</li>
          <li>Q1: Webhook 通知（incident / maintenance）</li>
          <li>Q1: 不正判定ロジック変更 diff レポート公開</li>
        </ul>
      </AboutSection>
    </div>
  </AboutLayout>
</template>
