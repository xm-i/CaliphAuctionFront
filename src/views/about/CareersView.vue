<script setup lang="ts">
// 採用情報ページ
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="採用情報"
    :enable-toc="true"
    description="リアルタイム競争体験の新しいスタンダードを共に形にする仲間を募集しています。技術的挑戦と透明性志向の文化の両立を目指します。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10"
    >
      <AboutSection title="募集職種（例）">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <h3 class="font-medium">エンジニアリング</h3>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li>フロントエンドエンジニア（Vue3 / WebSocket 最適化）</li>
              <li>バックエンドエンジニア（C# / .NET ）</li>
              <li>SRE（Observability / インフラ自動化）</li>
              <li>セキュリティエンジニア（不正検知 / 脆弱性診断）</li>
            </ul>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium">ビジネス・その他</h3>
            <ul class="list-disc pl-5 text-sm space-y-1">
              <li>プロダクトマネージャー</li>
              <li>カスタマーサクセス / オペレーション</li>
              <li>テクニカルライター（公開仕様 / 透明性レポート）</li>
              <li>データアナリスト（行動ログ解析）</li>
            </ul>
          </div>
        </div>
      </AboutSection>

      <AboutSection title="働き方">
        <p class="text-sm leading-relaxed">
          フルリモートとオフィス出社のハイブリッド（任意）。非同期ドキュメント（ADR
          /
          実験ログ）を重視し週次で小規模リリース。数値インパクトを翌週レビューする短サイクル開発。深夜の常態的オンコールは避け
          SLO ベースで優先度判断します。
        </p>
      </AboutSection>

      <AboutSection title="開発スタック / プロセス">
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>フロント：Vue 3 / Vite / TypeScript / Tailwind</li>
          <li>リアルタイム：WebSocket / SignalR 互換レイヤー / Redis PubSub</li>
          <li>
            監視：OpenTelemetry / 時系列 DB + ログ集約 / SLO ダッシュボード
          </li>
          <li>品質：コントラクトテスト + 変更影響差分分析</li>
          <li>
            基盤（Azure）：
            <ul class="list-disc pl-5 mt-1 space-y-0.5">
              <li>Compute: AKS / Container Apps</li>
              <li>Messaging: Service Bus / Event Hubs</li>
              <li>Cache & Realtime: Azure Cache for Redis</li>
              <li>Data: Azure SQL / Cosmos DB / Data Lake</li>
              <li>Storage: Blob Storage（署名付 URL）</li>
              <li>Observability: Monitor / Log Analytics / Managed Grafana</li>
              <li>Secrets & ID: Key Vault / Entra ID</li>
              <li>CI/CD: GitHub Actions → Deployment Environments</li>
              <li>
                Security: Defender for Cloud / Container Scan / Policy Gate
              </li>
            </ul>
          </li>
        </ul>
      </AboutSection>

      <AboutSection title="選考プロセス（目安）">
        <ol class="list-decimal pl-6 text-sm space-y-1">
          <li>書類（職務経歴 / GitHub / 成果物 URL）</li>
          <li>カジュアル面談（カルチャーフィット）</li>
          <li>技術 or ケース課題（リポジトリクローン形式）</li>
          <li>最終面談（行動特性と価値観）</li>
          <li>オファー面談（条件 / 入社時期調整）</li>
        </ol>
        <p class="text-xs text-muted-foreground">
          ※ プロセスは変更される場合があります。
        </p>
      </AboutSection>

      <AboutSection title="ML（Management Level）体系 & 報酬レンジ">
        <p class="text-sm leading-relaxed mb-3">
          職種横断で一貫したインパクト評価のため
          <span class="font-medium">ML13 をエントリー</span>
          とし数字が小さいほどスコープと戦略裁量が拡大。<span
            class="font-medium"
            >ML7 が People Manager</span
          >
          の下限、<span class="font-medium">ML4 以上が Managing Director</span>
          領域。下記はベース給与目安（SO / ボーナス除く）。
        </p>
        <div class="overflow-x-auto rounded-md border">
          <table class="w-full text-xs md:text-sm">
            <thead class="bg-muted/50 text-left">
              <tr>
                <th class="p-2 font-medium">ML</th>
                <th class="p-2 font-medium">レベル名</th>
                <th class="p-2 font-medium">主な責務</th>
                <th class="p-2 font-medium whitespace-nowrap">
                  年収レンジ（万円）
                </th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr>
                <td class="p-2 font-mono">ML13</td>
                <td class="p-2">Associate</td>
                <td class="p-2">明確タスク安定遂行 / 品質基準習得</td>
                <td class="p-2">500〜620</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML12</td>
                <td class="p-2">Engineer</td>
                <td class="p-2">複数コンポーネント統合 / 軽微設計</td>
                <td class="p-2">620〜780</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML11</td>
                <td class="p-2">Experienced Engineer</td>
                <td class="p-2">機能 E2E / 運用指標可視化</td>
                <td class="p-2">730〜920</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML10</td>
                <td class="p-2">Senior Engineer</td>
                <td class="p-2">サービス境界設計 / 性能改善</td>
                <td class="p-2">880〜1,120</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML9</td>
                <td class="p-2">Principal Engineer</td>
                <td class="p-2">複数チーム技術方針 / 障害学習体系化</td>
                <td class="p-2">1,050〜1,300</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML8</td>
                <td class="p-2">Associate Manager</td>
                <td class="p-2">長期技術ロードマップ / 基盤判断</td>
                <td class="p-2">1,250〜1,550</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML7</td>
                <td class="p-2">Manager</td>
                <td class="p-2">組織ヘルス / 採用 / 戦術整合</td>
                <td class="p-2">1,575〜1,950</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML6</td>
                <td class="p-2">Senior Manager</td>
                <td class="p-2">複数ドメイン戦略 / 人材ポートフォリオ</td>
                <td class="p-2">1,800〜2,250</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML5</td>
                <td class="p-2">Associate Director</td>
                <td class="p-2">事業計画 / 投資配分 / ガバナンス</td>
                <td class="p-2">2,100〜2,700</td>
              </tr>
              <tr>
                <td class="p-2 font-mono">ML4+</td>
                <td class="p-2">Managing Director</td>
                <td class="p-2">全社戦略 / 資本政策 / 大型提携</td>
                <td class="p-2">2,550〜3,300+</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          ※ レンジは参考。希少スキル・実績インパクト・勤務地で上下。SO /
          ボーナス別枠。前職総報酬と社内同一 ML
          バンド中央値整合性を考慮し最終オファーを提示。
        </p>
      </AboutSection>

      <AboutSection title="給与モデル / インセンティブ">
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>年 1 回ベース給与レビュー（市況 / 役割拡張考慮）</li>
          <li>四半期 OKR + プロダクト KPI 寄与でパフォーマンスボーナス</li>
          <li>全社インパクト（MTTR 改善 / 収益性改善等）にスポット賞与</li>
          <li>ストックオプション: 1 年クリフ / 4 年ベスト / 早期行使検討</li>
        </ul>
      </AboutSection>

      <AboutSection title="評価制度（概要）">
        <p class="text-sm leading-relaxed">
          短期アウトプット量だけでなく
          <span class="font-medium">再現性ある改善プロセス設計</span> /
          <span class="font-medium">長期負債コスト低減</span> /
          <span class="font-medium">チーム能力底上げ</span>
          を総合評価。半期ごとに 360° コメントを収集。
        </p>
        <ol class="list-decimal pl-6 text-sm space-y-1 mt-2">
          <li>自己レビュー（定量指標 + 学習メトリクス）</li>
          <li>ピアレビュー（最大 5 名 / 行動特性）</li>
          <li>リード面談（成長支援ギャップ整理）</li>
          <li>最終キャリブレーション（バイアス低減）</li>
        </ol>
      </AboutSection>

      <AboutSection title="福利厚生（例）">
        <div class="grid md:grid-cols-2 gap-6">
          <ul class="list-disc pl-6 text-sm space-y-1">
            <li>フルリモート手当 / コワーキング補助</li>
            <li>学習支援（技術書 / SaaS / カンファレンス）</li>
            <li>最新ノート PC + 外部モニタ 2 枚 + 周辺デバイス選択制</li>
            <li>インシデント改善貢献スポットボーナス</li>
            <li>OSS コントリビューション（週 4h 目安）業務計上</li>
            <li>年 1 回ヘルスチェック / メンタルサポート窓口</li>
          </ul>
          <ul class="list-disc pl-6 text-sm space-y-1">
            <li>副業（競合しない範囲）事前申請可</li>
            <li>有給前倒し付与 / 半休 / 1h 単位取得トライアル</li>
            <li>産休・育休 / 介護休（法定 + 追加日数）</li>
            <li>リモート電気・通信費一部補助</li>
            <li>ナレッジ共有会（月 1）登壇インセンティブ</li>
            <li>書類言語: 日本語 / 英語（段階的バイリンガル化）</li>
          </ul>
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          ※ 制度はベータ運用中で改善フィードバック歓迎です。
        </p>
      </AboutSection>

      <AboutSection title="開発環境詳細">
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>Issue: GitHub Projects / 軽量 RFC (ADR)</li>
          <li>CI: GitHub Actions（静的解析 / 差分 / E2E）</li>
          <li>品質: パフォーマンスバジェット / Lighthouse 監視</li>
          <li>セキュリティ: 依存脆弱性自動 PR / ソース差分監査</li>
          <li>ナレッジ: SharePoint ポータル + アーカイブ検索</li>
          <li>コミュニケーション: Teams / 非同期設計メモ</li>
        </ul>
      </AboutSection>

      <AboutSection title="応募のヒント">
        <p class="text-sm leading-relaxed">
          技術課題では「最適化前の正確さ」「計測による検証」「トレードオフ記述」を重視。OSS
          やアーキ記事への建設的批評、障害再発防止設計などの URL
          があれば添付ください。
        </p>
      </AboutSection>

      <AboutSection title="求めるマインド">
        <p class="text-sm leading-relaxed">
          「最短で動くモノを出し計測し学習する」ループを楽しめる /
          抽象語だけでなく計測指標と再現手順を併記できる /
          完全性より改善速度と学習コスト最小化の均衡感覚 /
          セキュリティ・公平性懸念を率直に指摘できる。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
</template>
