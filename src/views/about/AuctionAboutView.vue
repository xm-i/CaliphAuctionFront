<script setup lang="ts">
// オークションとはページ
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>

<template>
  <AboutLayout
    title="オークションとは"
    :enable-toc="true"
    description="時間延長型差額入札方式（俗にペニーオークション）の基本構造と初参加時に押さえたい要点を整理しています。仕組みの理解は無駄なポイント消費を抑え戦略的参加につながります。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10"
    >
      <AboutSection title="基本ルール">
        <p class="leading-relaxed text-sm md:text-base mb-3">
          ペニーオークションは「カウントダウン」「少額加算」「残時間延長」が組み合わさった競争型の購入手段です。1
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
