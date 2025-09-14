<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="会社概要"
    description="本サービスを運営する組織の基本情報です。なお、実在の法人ではありません。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="基本情報">
        <table class="w-full text-sm border rounded-md overflow-hidden">
          <tbody>
            <tr class="border-b">
              <th class="bg-muted/50 p-2 text-left w-40">名称</th>
              <td class="p-2">Caliph Auction Technologies</td>
            </tr>
            <tr class="border-b">
              <th class="bg-muted/50 p-2 text-left">所在地</th>
              <td class="p-2">Virtual District / Internet</td>
            </tr>
            <tr class="border-b">
              <th class="bg-muted/50 p-2 text-left">代表</th>
              <td class="p-2">中森 未来</td>
            </tr>
            <tr class="border-b">
              <th class="bg-muted/50 p-2 text-left">事業内容</th>
              <td class="p-2">
                リアルタイム入札型エンタメプラットフォームの企画・開発
              </td>
            </tr>
            <tr>
              <th class="bg-muted/50 p-2 text-left">提供開始</th>
              <td class="p-2">2024 (β)</td>
            </tr>
          </tbody>
        </table>
      </AboutSection>
      <AboutSection title="ミッション / ビジョン">
        <p>
          カリフオークションはリアルタイム性・透明性・公平性を軸に「参加ハードルの低いデジタル入札体験」を再設計することを目的として構想された実験的プロジェクトです。単に商品を安く買う場ではなく、<span
            class="font-medium"
            >“戦略と心理が交差するライブエンタメ”</span
          >としての価値を磨き続けています。正確なサーバー同期カウントダウン、遅延計測、入札アクティビティ監視を組み合わせ、公平性を技術で裏付けることを重視しています。高速入札と価格変動をゲーム的要素として楽しみつつも、信頼を損なわない技術スタックと運用体制を両立し、将来的にはリアルタイム取引インフラとしての外部
          API 化を視野に入れています。
        </p>
      </AboutSection>
      <AboutSection title="バリュー（行動指針）">
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <span class="font-medium">Fairness First:</span>
            仕様に曖昧さを残さず内部ロジックを文書化
          </li>
          <li>
            <span class="font-medium">Latency is UX:</span> 100ms
            以内の反応を理想とするパフォーマンス文化
          </li>
          <li>
            <span class="font-medium">Evidence Based:</span>
            感覚ではなくメトリクス・ログを起点に議論
          </li>
          <li>
            <span class="font-medium">Iterative Trust:</span>
            小さな透明性改善を継続して信頼を積み上げる
          </li>
        </ul>
      </AboutSection>
      <AboutSection title="沿革（抜粋）">
        <ul class="text-sm space-y-1">
          <li>2025/01 法人設立・シード調達</li>
          <li>2025/03 クローズドβ（内部 50 アカウント）</li>
          <li>2025/05 不正検知エンジン v1 リリース</li>
          <li>2025/07 外部決済ゲートウェイ統合（クレカ / ウォレット）</li>
          <li>2025/09 パブリックβ拡大・監視基盤刷新</li>
        </ul>
      </AboutSection>
      <AboutSection title="事業内容">
        <p>
          リアルタイム入札型エンタメプラットフォームの企画・開発・運用。入札体験に付随する不正検知、低遅延配信、決済フロー最適化、行動分析、在庫同期、ユーザー保護機能などの
          R&D を含みます。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
  <!-- 旧オプション API export を除去 -->
</template>
