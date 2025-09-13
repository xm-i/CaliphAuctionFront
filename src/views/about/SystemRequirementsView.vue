<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="動作環境"
    :enable-toc="true"
    description="リアルタイム性と視認性を最大化するための推奨ブラウザやネットワーク条件、端末スペック、アクセシビリティ設定の指針をまとめています。最低要件を満たさない環境では遅延や UI 崩れが発生する可能性があります。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="推奨ブラウザ">
        <ul class="list-disc pl-6 space-y-1">
          <li>Chrome / Edge 最新安定版（自動更新有効推奨）</li>
          <li>Firefox 最新版</li>
          <li>Safari (macOS / iOS) 最新メジャー + 1</li>
        </ul>
        <p class="text-xs text-muted-foreground mt-2">
          ※ β版では一部旧バージョンでレイアウト差異が発生する場合があります。
        </p>
      </AboutSection>
      <AboutSection title="ネットワーク要件">
        <ul class="list-disc pl-6 space-y-1">
          <li>下り 5Mbps / 上り 1Mbps 以上（安定度を優先）</li>
          <li>平均 RTT 150ms 以下（200ms 超で入札反映遅延を体感する可能性）</li>
          <li>過度なパケットロス（>2%）は再接続頻度増加の要因</li>
        </ul>
        <p class="text-xs text-muted-foreground mt-2">
          公衆 Wi-Fi 利用時は暗号化と電源管理によるスリープ抑制に注意。
        </p>
      </AboutSection>
      <AboutSection title="端末スペック目安">
        <table class="w-full text-sm border rounded-md overflow-hidden">
          <thead class="bg-muted/50 text-left">
            <tr>
              <th class="p-2">項目</th>
              <th class="p-2">最低</th>
              <th class="p-2">推奨</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-2">CPU</td>
              <td class="p-2">2 コア 1.6GHz 相当</td>
              <td class="p-2">4 コア 2.4GHz 以上</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">メモリ</td>
              <td class="p-2">4GB</td>
              <td class="p-2">8GB 以上</td>
            </tr>
            <tr class="border-t">
              <td class="p-2">解像度</td>
              <td class="p-2">1280x720</td>
              <td class="p-2">1920x1080 以上</td>
            </tr>
          </tbody>
        </table>
      </AboutSection>
      <AboutSection title="ブラウザ設定">
        <ul class="list-disc pl-6 space-y-1">
          <li>JavaScript / Cookie / LocalStorage 有効</li>
          <li>タブの自動スリープ機能を無効化（入札遅延防止）</li>
          <li>追跡防止レベル「標準」推奨（過度なブロックは接続切断の恐れ）</li>
        </ul>
      </AboutSection>
      <AboutSection title="アクセシビリティ">
        <ul class="list-disc pl-6 space-y-1">
          <li>キーボード操作: 主要操作要素にフォーカスリング提供</li>
          <li>コントラスト比: 主要テキストは WCAG AA 以上を基準</li>
          <li>スクリーンリーダー: ボタン/状態更新へ ARIA ラベル順次追加予定</li>
          <li>アニメーション: モーション軽減 OS 設定を検出し簡易表示モード</li>
        </ul>
      </AboutSection>
      <AboutSection title="既知の制限">
        <p>
          一部古い Android
          標準ブラウザでは再接続時のセッション復元に失敗するケースを確認しています。発生した場合は
          Chrome 最新版への切替を推奨します。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
  <!-- 旧オプション API script を除去 -->
</template>
