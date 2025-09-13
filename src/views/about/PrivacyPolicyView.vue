<script setup lang="ts">
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="プライバシーポリシー"
    :enable-toc="true"
    description="本ポリシーは当サービスが利用者の個人情報および関連データ（行動ログ・技術メタ情報等）をどのような目的と手段で取得 / 利用 / 保管 / 共有し、利用者がどのような権利を有するかを定めるものです。正式版公開までの暫定ドキュメントとして位置づけています。"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10 text-sm leading-relaxed"
    >
      <AboutSection title="1. 取得する情報">
        <ul class="list-disc pl-6 space-y-1">
          <li>アカウント情報：メールアドレス、表示名、認証関連トークン</li>
          <li>取引関連：入札履歴、ポイント残高、購入/配送ステータス</li>
          <li>
            技術ログ：IP（一部マスク処理）、User-Agent、接続遅延、エラーコード
          </li>
          <li>
            行動データ：画面閲覧イベント（匿名化 ID）、インタラクション頻度
          </li>
          <li>サポート履歴：問い合わせ内容、対応メモ、添付ファイル</li>
        </ul>
      </AboutSection>
      <AboutSection title="2. 利用目的">
        <ul class="list-disc pl-6 space-y-1">
          <li>サービス提供（入札処理、決済、配送手配）</li>
          <li>不正利用/セキュリティインシデントの検知・防止</li>
          <li>利用動向分析による機能改善とパフォーマンス最適化</li>
          <li>問い合わせ対応および本人確認</li>
          <li>法令に基づく記録・報告</li>
        </ul>
      </AboutSection>
      <AboutSection title="3. クッキー等の利用">
        <p>
          セッション管理・CSRF 防止・パフォーマンス測定にクッキー / LocalStorage
          を使用します。ブラウザ設定で無効化した場合一部機能が動作しません。
        </p>
      </AboutSection>
      <AboutSection title="4. 第三者提供">
        <p>以下の場合を除き第三者へ個人情報を提供しません。</p>
        <ul class="list-disc pl-6 space-y-1 mt-2">
          <li>法令に基づく開示要請</li>
          <li>決済・配送等 業務委託先への必要最小限の提供</li>
          <li>統計加工された匿名化データの公開（個人再識別不能）</li>
        </ul>
      </AboutSection>
      <AboutSection title="5. 安全管理措置">
        <ul class="list-disc pl-6 space-y-1">
          <li>権限最小化とアクセスログ監査</li>
          <li>暗号化（保存時：重要トークン、通信時：TLS1.3）</li>
          <li>改ざん検知（監査ログのハッシュチェーン化）</li>
          <li>従業員へのセキュリティ教育（年 1 回以上）</li>
        </ul>
      </AboutSection>
      <AboutSection title="6. 利用者の権利">
        <p>
          登録された個人情報の開示・訂正・削除・利用停止を希望される場合、本人確認手続き後、合理的範囲で速やかに対応します。
        </p>
      </AboutSection>
      <AboutSection title="7. データ保存期間">
        <p>
          法令に特段の定めがあるものを除き、退会後最長 2
          年で個人識別可能データを削除または匿名化します。ログ分析用派生データは集計形式で保持する場合があります。
        </p>
      </AboutSection>
      <AboutSection title="8. ポリシー変更">
        <p>
          重大な変更を行う際は施行日の 14
          日前までに告知します。軽微な文言調整は即時反映される場合があります。
        </p>
      </AboutSection>
      <AboutSection title="9. 連絡先">
        <p>privacy@example-auction.jp までご連絡ください。</p>
      </AboutSection>
    </div>
  </AboutLayout>
  <!-- 旧オプション API export は不要 -->
</template>
