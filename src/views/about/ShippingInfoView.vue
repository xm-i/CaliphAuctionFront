<script setup lang="ts">
// 配送について
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="配送について"
    :enable-toc="true"
    description="落札後の商品到着までの標準プロセス、オプション、追跡・遅延時の対応方針をまとめています。内部在庫システムと連携しステータスを更新します。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="標準配送フロー">
        <ol class="list-decimal pl-6 space-y-1">
          <li>落札後 24 時間以内に購入手続き（支払確定）</li>
          <li>在庫確定・検品（通常 1〜2 営業日）</li>
          <li>梱包 & ラベル発行（自動化システム更新）</li>
          <li>出荷（宅配業者へ引き渡し）</li>
          <li>追跡番号メール / マイページ反映</li>
          <li>受領・不備報告期間（受領後 7 日以内）</li>
        </ol>
        <p class="text-xs text-muted-foreground mt-2">
          ※ 年末年始 / 災害等で前後する場合があります。
        </p>
      </AboutSection>
      <AboutSection title="配送オプション">
        <table class="w-full text-sm border rounded-md overflow-hidden">
          <thead class="bg-muted/50 text-left">
            <tr>
              <th class="p-2">種別</th>
              <th class="p-2">目安日数</th>
              <th class="p-2">追跡</th>
              <th class="p-2">保険</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-2">標準</td>
              <td class="p-2">1-3 営業日</td>
              <td class="p-2">あり</td>
              <td class="p-2">紛失時上限規定</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">速達</td>
              <td class="p-2">当日〜翌日</td>
              <td class="p-2">あり</td>
              <td class="p-2">標準 + 拡張補償</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">大型専用</td>
              <td class="p-2">3-5 営業日</td>
              <td class="p-2">あり</td>
              <td class="p-2">個別見積</td>
            </tr>
          </tbody>
        </table>
      </AboutSection>
      <AboutSection title="追跡とステータス更新">
        <p>
          マイページ「配送状況」は内部イベントストリームからほぼリアルタイム（最大遅延
          2 分程度）で更新。外部配送 API 遅延時は「取得保留」と表示。12
          時間以上動きが無い場合はサポートへ。
        </p>
      </AboutSection>
      <AboutSection title="梱包ポリシー">
        <ul class="list-disc pl-6 space-y-1">
          <li>カテゴリ別緩衝材テンプレート</li>
          <li>再利用可能資材は状態確認後リユース</li>
          <li>高額商品は開封防止シール + シリアル記録</li>
        </ul>
      </AboutSection>
      <AboutSection title="遅延・紛失時の対応">
        <p>
          目安 +2 営業日超の遅延で内部調査 → 業者照会 →
          暫定通知。紛失確定時は在庫代替または返金（ポイント +
          決済額）選択可。後日到着時は開封前に連絡。
        </p>
      </AboutSection>
      <AboutSection title="受領後の不備報告">
        <p>
          受領 7 日以内に破損・欠品を報告。写真（外箱 / 内部 / 本体）3
          枚以上添付で迅速化。期間経過後は補償対象外となる場合があります。
        </p>
        <p
          class="mt-8 text-[10px] md:text-[11px] text-muted-foreground leading-snug"
        >
          ※
          記載の配送手順・期間・補償内容はデモ目的のフィクションであり実際の発送や権利移転は行われません。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
</template>
