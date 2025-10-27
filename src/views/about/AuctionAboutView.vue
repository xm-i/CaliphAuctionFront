<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>

<template>
  <AboutLayout
    title="カリフオークションとは"
    :enable-toc="true"
    description="時間延長型差額入札方式の基本構造と初参加時に押さえたい要点を整理しています。仕組みの理解は無駄なポイント消費を抑え戦略的参加につながります。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10"
    >
      <AboutSection title="基本ルール">
        <p class="leading-relaxed text-sm md:text-base mb-3">
          カリフオークションは「カウントダウン」「少額加算」「残時間延長」が組み合わさった競争型の購入手段です。1
          回の入札で (1) 価格が最小増分だけ上昇 (2) 残時間が数秒延長 (3)
          最高入札者が更新され、タイマーが 0
          に達した時点の最高入札者が落札権を得ます。入札に使ったポイントは原則返還されません（特例プロモーションを除く）。
        </p>
        <ul class="list-disc pl-6 space-y-1 text-sm">
          <li>入札毎に残り時間が<span class="font-medium">数秒延長</span></li>
          <li>チャージしたポイントを消費して入札</li>
          <li>
            <span class="font-medium">判断力向上支援</span
            >（統計/リプレイ）を段階提供予定
          </li>
          <li>公正性確保のためリアルタイム監視・検知エンジン稼働</li>
        </ul>
      </AboutSection>
      <AboutSection title="戦略のヒント">
        <p class="leading-relaxed text-sm md:text-base mb-3">
          鍵となるのは「相場観」「参加タイミング」「残ポイント管理」。過去終了時刻帯と残り
          30〜60
          秒の入札頻度を観察し集中投下する時間帯を推定します。序盤の過剰クリックは消耗を増やすだけなので、統計パネルや（提供予定の）リプレイログを使い差し込み精度を磨く反復学習が有効です。
        </p>
        <div
          class="bg-muted/40 border rounded-md p-4 text-xs md:text-sm space-y-2"
        >
          <p class="font-semibold">ポイント節約の小技</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>“静かな”時間帯（早朝 / 深夜）を試す</li>
            <li>終了間際のみ現れるスナイパー型ユーザーの出現秒数を記録</li>
            <li>競合ユーザーの行動間隔を簡易ログ化</li>
            <li>感情的連打を避け 3〜5 秒のリズムを維持</li>
          </ul>
        </div>
      </AboutSection>
      <AboutSection title="公正性と監視体制">
        <p class="leading-relaxed text-sm md:text-base">
          不正検知エンジンが入札間隔や協調挙動をスコアリングし、疑わしいパターンは隔離キューで人間審査。AI
          判定のみで即停止は行わず、将来的に落札履歴ハッシュ検証 API /
          署名開示を計画しています。
        </p>
      </AboutSection>
      <AboutSection title="歴史的背景と 2012 年頃のペニーオークション問題">
        <p class="leading-relaxed text-sm md:text-base mb-3">
          2012 年前後、日本国内でも
          <span class="font-medium">「ペニーオークション」</span>
          と呼ばれる形式が話題になりました。これは 1
          回の入札ごとに「少額の入札手数料（ポイント等）を消費」「表示価格が最小刻みで上昇」「残り時間が数秒延長」する<strong>時間延長型差額入札モデル</strong>で、<span
            class="font-medium"
            >当サービスと全く同じ仕組み・構造</span
          >です。
        </p>
        <p class="leading-relaxed text-sm md:text-base mb-3">
          当時一部サービスでは、(1) 実質的に落札困難な設定や過度な広告強調、(2)
          ステルスマーケティング手法による不透明な集客、(3)
          不正な自動入札（と疑われる挙動）に関する報道などがあり、消費者保護／表示適正の観点から問題が指摘されました。これらは<strong>運営ポリシーと透明性の欠如</strong>に起因するものです。
        </p>
      </AboutSection>
      <AboutSection title="公開リポジトリ (ソースコード)">
        <p class="leading-relaxed text-sm md:text-base mb-4">
          本サイトの関連ソースコードは以下の GitHub リポジトリで公開しています。
          監査・検証・学習目的で自由に参照してください（ライセンス条件を遵守の上でご利用ください）。
        </p>
        <ul class="space-y-3 text-sm md:text-base">
          <li class="border rounded-md p-3 bg-muted/30 dark:bg-muted/20">
            <p class="font-semibold mb-1">フロントエンド (SPA / Vue)</p>
            <a
              href="https://github.com/xm-i/CaliphAuctionFront"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary underline-offset-2 hover:underline break-all"
              aria-label="CaliphAuctionFront リポジトリ (新しいタブで開く)"
              >https://github.com/xm-i/CaliphAuctionFront</a
            >
          </li>
          <li class="border rounded-md p-3 bg-muted/30 dark:bg-muted/20">
            <p class="font-semibold mb-1">
              バックエンド (API / SignalR / 入札BOT)
            </p>
            <a
              href="https://github.com/xm-i/CaliphAuctionBackend"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary underline-offset-2 hover:underline break-all"
              aria-label="CaliphAuctionBackend リポジトリ (新しいタブで開く)"
              >https://github.com/xm-i/CaliphAuctionBackend</a
            >
          </li>
          <li class="border rounded-md p-3 bg-muted/30 dark:bg-muted/20">
            <p class="font-semibold mb-1">インフラ (IaC / CI/CD)</p>
            <a
              href="https://github.com/xm-i/CaliphAuctionInfrastructure"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary underline-offset-2 hover:underline break-all"
              aria-label="CaliphAuctionInfrastructure リポジトリ (新しいタブで開く)"
              >https://github.com/xm-i/CaliphAuctionInfrastructure</a
            >
          </li>
        </ul>
        <p
          class="mt-4 text-xs md:text-[11px] text-muted-foreground leading-relaxed"
        >
          ※ コミット履歴や Pull Request を通じて開発過程や設計意図を追跡でき、
          公開ソースの監査は利用者の自己防衛・モデル理解に資する重要な手段です。
        </p>
      </AboutSection>
      <AboutSection title="よくある質問 (FAQ)">
        <div class="space-y-3 text-sm">
          <details class="border rounded-md p-3 bg-card/40">
            <summary class="cursor-pointer font-medium">
              入札に失敗したのにポイントが減っています
            </summary>
            <p class="mt-2 leading-relaxed">
              入札クリックがサーバーへ到達し処理された時点で消費されます。UI
              反映が遅れてもサーバーログが正となります。
            </p>
          </details>
          <details class="border rounded-md p-3 bg-card/40">
            <summary class="cursor-pointer font-medium">
              外部の自動化スクリプト利用は可能ですか？
            </summary>
            <p class="mt-2 leading-relaxed">
              公平性と観戦価値を損なう恐れがあるため外部ツールによる機械的連続入札は利用規約上禁止。検出時はログ精査と是正措置（警告
              / 一時停止等）を行います。
            </p>
          </details>
          <details class="border rounded-md p-3 bg-card/40">
            <summary class="cursor-pointer font-medium">
              途中で離席したらどうなりますか
            </summary>
            <p class="mt-2 leading-relaxed">
              タイマー進行で他ユーザーが最高入札者になれば権利喪失。ウォッチ通知や統計リマインダー（予定）を活用し重要時間帯に再参加を。
            </p>
          </details>
        </div>
        <p
          class="mt-10 text-[10px] md:text-[11px] text-muted-foreground leading-snug"
        >
          ※
          本ページの入札・落札・ポイント等はデモ表示であり実在取引や決済・権利移転は生じません。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
</template>
