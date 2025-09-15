<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="お客様サポート"
    :enable-toc="true"
    description="利用方法・不具合・権利侵害報告・不正疑いなど各種お問い合わせ手段の一覧です。内容により回答優先度が異なる場合があります。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="1. サポートチャネル">
        <table class="w-full text-sm border rounded-md overflow-hidden">
          <thead class="bg-muted/50 text-left">
            <tr>
              <th class="p-2">チャネル</th>
              <th class="p-2">用途</th>
              <th class="p-2">応答目標</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-2">メール</td>
              <td class="p-2">一般的な質問 / アカウント照会</td>
              <td class="p-2">1 営業日</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">フォーム</td>
              <td class="p-2">不具合報告 / 改善提案</td>
              <td class="p-2">8 営業時間以内</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">緊急タグ付きメール</td>
              <td class="p-2">重大障害（決済 / 入札不可）</td>
              <td class="p-2">2 時間以内 初期応答</td>
            </tr>
          </tbody>
        </table>
        <p class="text-xs text-muted-foreground mt-2">
          ※ β段階では電話サポートは提供していません。
        </p>
      </AboutSection>
      <AboutSection title="2. 受付時間">
        <ul class="list-disc pl-6 space-y-1">
          <li>標準サポート: 平日 10:00 - 18:00 (土日祝除く)</li>
          <li>重大障害窓口: 365日 / 6:00 - 24:00（縮退体制）</li>
        </ul>
      </AboutSection>
      <AboutSection title="3. エスカレーションポリシー">
        <ol class="list-decimal pl-6 space-y-1">
          <li>L1: 初期トリアージ（カテゴリ分類 / 再現性確認）</li>
          <li>L2: 技術担当がログ / メトリクス / 影響幅を解析</li>
          <li>L3: アーキテクト / セキュリティレビュー（必要時）</li>
          <li>ポストモーテム作成 & 再発防止策チケット化</li>
        </ol>
      </AboutSection>
      <AboutSection title="4. 問い合わせ時にあると助かる情報">
        <ul class="list-disc pl-6 space-y-1">
          <li>発生時刻（タイムゾーン込み）</li>
          <li>利用端末 / OS / ブラウザバージョン</li>
          <li>問題が起きた画面の URL</li>
          <li>再現手順（できるだけ短く番号付き）</li>
          <li>表示されたエラーメッセージ全文</li>
          <li>スクリーンショット（複数枚）または短い動画</li>
        </ul>
      </AboutSection>
      <AboutSection title="5. ステータス確認">
        <p>
          重大障害が認識された場合は「お知らせ」ページへ初報を掲載します。復旧見込み時間を確定できない場合も
          60 分毎に暫定アップデートを行う方針です。
        </p>
      </AboutSection>
      <AboutSection title="6. 個人情報を含む問い合わせ">
        <p>
          本人確認が必要なサポート（アカウント停止解除など）は追加の認証手続き（登録メールアドレス
          + 最近の入札 ID
          提示等）をお願いする場合があります。機密性の高い情報は必ず暗号化リンクフォームをご利用ください。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
  <!-- 旧オプション API script 削除 -->
</template>
