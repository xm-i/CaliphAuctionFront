<script setup lang="ts">
// 利用規約（サンプル短縮版）
import AboutLayout from "@/components/about/AboutLayout.vue";
import AboutSection from "@/components/about/AboutSection.vue";
</script>
<template>
  <AboutLayout
    title="利用規約"
    description="本規約は利用者（以下ユーザー）と当社の間で提供される本サービスの利用条件を定めるものです。ベータ版として公開しており、内容は将来更新される可能性があります。"
    :enable-toc="true"
  >
    <div
      class="bg-card/50 backdrop-blur rounded-xl border p-6 md:p-8 space-y-10"
    >
      <AboutSection title="第1条（定義）">
        <p>
          「本サービス」とは当社が提供する時間延長型オークションおよび関連機能を指します。ユーザーとは本サービスを利用するすべての個人または法人を意味します。
        </p>
      </AboutSection>
      <AboutSection title="第2条（適用）">
        <p>
          ユーザーは本規約に同意したうえで本サービスを利用するものとし、当社は合理的範囲で本規約を改定できます。変更後の利用継続は新規約への同意を意味します。
        </p>
      </AboutSection>
      <AboutSection title="第3条（アカウント）">
        <ul class="list-disc pl-6 space-y-1">
          <li>登録情報は真実かつ最新であること</li>
          <li>不正取得されたアカウントの譲渡・貸与は禁止</li>
          <li>認証情報管理はユーザーの責任</li>
        </ul>
      </AboutSection>
      <AboutSection title="第4条（ポイント）">
        <p>
          ポイントは入札にのみ使用でき、原則払い戻し不可です。システム上の表示不整合が生じた場合、サーバー側記録を正とします。
        </p>
      </AboutSection>
      <AboutSection title="第5条（禁止事項）">
        <ul class="list-disc pl-6 space-y-1">
          <li>自動化ツール等による大量高速入札（公表 API を除く）</li>
          <li>複数アカウントを用いた価格操作・談合</li>
          <li>逆コンパイルその他のリバースエンジニアリング</li>
          <li>当社または第三者の権利侵害行為</li>
          <li>脆弱性の悪用（発見時は速やかな報告を推奨）</li>
        </ul>
      </AboutSection>
      <AboutSection title="第6条（利用制限 / 停止）">
        <p>
          当社は以下の場合、事前通知なく利用制限またはアカウント停止を行うことがあります。（1）本規約違反（2）不正アクセスの疑い（3）セキュリティ保護の必要性が高いと当社が判断した場合。
        </p>
      </AboutSection>
      <AboutSection title="第7条（知的財産権）">
        <p>
          本サービスに含まれるプログラム・デザイン等の著作権その他一切の知的財産権は当社または正当な権利者に帰属します。
        </p>
      </AboutSection>
      <AboutSection title="第8条（保証の否認）">
        <p>
          当社は本サービスが常時中断なく利用可能であること、特定目的への適合性、完全性を保証しません。ベータ段階では機能変更や一時停止が予告なく発生する場合があります。
        </p>
      </AboutSection>
      <AboutSection title="第9条（免責）">
        <p>
          当社はユーザー間またはユーザーと第三者との間で生じたトラブルについて責任を負いません。ただし当社の重過失による損害は法令に定める範囲で賠償責任を負います。
        </p>
      </AboutSection>
      <AboutSection title="第10条（サービス変更・終了）">
        <p>
          当社は事業上の必要により本サービスの全部または一部を変更・中止できます。重要な変更は合理的期間の事前告知を目指します。
        </p>
      </AboutSection>
      <AboutSection title="第11条（準拠法・裁判管轄）">
        <p>
          本規約は日本法を準拠法とし、本サービスに関して紛争が生じた場合、所在地管轄の地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </AboutSection>
      <AboutSection title="第12条（お問い合わせ）">
        <p>
          本規約に関するお問い合わせは support@example-auction.jp
          までお願いします。
        </p>
      </AboutSection>
      <AboutSection title="第13条（本サービスの性質・フィクション性）">
        <p>
          本サービスはエンターテインメント性を目的とするデモンストレーション環境であり、表示される入札・落札・価格・配送・ポイント等は全てシミュレーション情報です。実在の売買・役務提供・所有権移転・決済（法定通貨/暗号資産含む）は成立しません。表示内容を現実の取引判断に利用した結果について当社は責任を負いません。実在名称が登場する場合でも提携・保証を意味するものではなく、利用継続により本条項に同意したものとみなします。
        </p>
      </AboutSection>
    </div>
  </AboutLayout>
</template>

<!-- 従来の export は不要になったため削除 -->
