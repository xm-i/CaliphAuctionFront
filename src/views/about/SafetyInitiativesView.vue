<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="安心・安全への取り組み"
    :enable-toc="true"
    description="公正性・可監査性・利用者保護を両立するための多層的な技術/運用施策をご紹介します。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="全体アーキテクチャの考え方">
        <p>
          セキュリティ層は「予防」「検知」「封じ込め」「回復」の 4
          フェーズに分解し、それぞれに責務と計測指標を設定しています。リアルタイムオークション特有の高速入札パターンを悪用したボット行為を抑止するため、遅延を最小化しつつシグナル抽出できる軽量観測レイヤーを実装しています。
        </p>
      </AboutSection>
      <AboutSection title="主な技術的施策">
        <ul class="list-disc pl-6 space-y-1">
          <li>
            <span class="font-medium">暗号化:</span> すべてのクライアント通信は
            TLS1.3 / HSTS 強制
          </li>
          <li>
            <span class="font-medium">ゼロトラスト:</span> 内部サービス間も mTLS
            / 最小権限トークン
          </li>
          <li>
            <span class="font-medium">不正検知:</span> 入札間隔・IP / Device
            Fingerprint・操作エントロピーを特徴量化
          </li>
          <li>
            <span class="font-medium">レート制御:</span> ユーザー / セッション /
            ネットブロック単位で段階制限
          </li>
          <li>
            <span class="font-medium">監査ログ:</span> ハッシュチェーン化 +
            定期スナップショット
          </li>
          <li>
            <span class="font-medium">安全なデプロイ:</span> 署名付きイメージ +
            ポリシー違反即時ロールバック
          </li>
        </ul>
      </AboutSection>
      <AboutSection title="不正入札検知フロー（概要）">
        <ol class="list-decimal pl-6 space-y-1">
          <li>イベントストリームへ入札 / 接続 / エラーをリアルタイム送出</li>
          <li>特徴量抽出（移動平均応答時間 / 行動ジッター / 指数平滑）</li>
          <li>ルールエンジン + 機械学習モデルでスコアリング</li>
          <li>閾値超過は暫定フラグ付与し挙動制限（ソフトレート）</li>
          <li>モデレーターキューで人間確認</li>
          <li>必要時アカウント一時停止 & 根本原因分析</li>
        </ol>
        <p class="text-xs text-muted-foreground mt-2">
          ※ モデルはデータドリフト検出後にロールフォワード。履歴は将来公開 API
          提供予定。
        </p>
      </AboutSection>
      <AboutSection title="ユーザー保護">
        <ul class="list-disc pl-6 space-y-1">
          <li>二段階認証（将来オプション）</li>
          <li>ログインアラート（新規デバイス通知）</li>
          <li>入札履歴の CSV / 署名付きエクスポート計画</li>
          <li>価格操作を避ける内部職員権限分離</li>
        </ul>
      </AboutSection>
      <AboutSection title="外部レビュー / 監査">
        <p>
          年 2 回の第三者セキュリティ診断（アプリケーション /
          インフラ）を実施予定です。重大度判定は CVSS に基づき、クリティカル /
          ハイは 14 日以内、ミディアムは 45
          日以内、ロウは次回計画内で対応する目標を設定します。主要コンポーネントの
          SBOM を生成し依存ライブラリの脆弱性を継続監視します。
        </p>
      </AboutSection>
      <AboutSection title="インシデント対応方針">
        <p>
          検知後は (1) 影響範囲スコープ確定 (2) 一時的封じ込め (3)
          恒久対策案作成 (4) ポストモーテム公開 の順で進行。ポストモーテムは
          blame を避け学習と予防改善に注力します。
        </p>
      </AboutSection>
      <AboutSection title="利用者の皆さまへのお願い">
        <p>
          不審な入札パターンや UI
          表示の不整合を発見した場合は、スクリーンショットと発生時刻を添えてサポートまでご報告ください。早期連携が全体の公正性向上に直結します。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
  <!-- オプション API script を削除 -->
</template>
