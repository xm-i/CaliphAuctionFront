<script lang="ts" setup>
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import Label from "@/components/ui/label/Label.vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { register } from "@/api/auth";
import { RouterLink } from "vue-router";

const router = useRouter();

const schema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .email({ message: "メールアドレスの形式が正しくありません" }),
      password: z.string().min(8, { message: "8文字以上で入力してください" }),
      passwordConfirm: z
        .string()
        .min(8, { message: "8文字以上で入力してください" }),
      username: z
        .string()
        .min(3, { message: "3文字以上で入力してください" })
        .max(50, { message: "50文字以下で入力してください" }),
      termsAccepted: z
        .boolean()
        .refine((v) => v === true, { message: "利用規約に同意してください" }),
    })
    .refine((d) => d.password === d.passwordConfirm, {
      message: "パスワードが一致しません",
      path: ["passwordConfirm"],
    })
);

const { defineField, handleSubmit, errors, meta, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    termsAccepted: false,
  },
});

const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");
const [passwordConfirm, passwordConfirmProps] = defineField("passwordConfirm");
const [username, usernameProps] = defineField("username");
const [termsAccepted, termsAcceptedProps] = defineField("termsAccepted");

const onSubmit = handleSubmit(async (values) => {
  await register({
    email: values.email,
    password: values.password,
    username: values.username,
  });
  router.replace({ name: "signup-success" });
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-8">
    <form class="space-y-6" @submit.prevent="onSubmit">
      <div>
        <Label for="email">メールアドレス</Label>
        <Input
          id="email"
          v-model="email"
          v-bind="emailProps"
          placeholder="mail@example.com"
        />
        <p v-if="errors.email" class="text-sm text-red-600 mt-1">
          {{ errors.email }}
        </p>
      </div>
      <div>
        <Label for="password">パスワード</Label>
        <Input
          id="password"
          v-model="password"
          v-bind="passwordProps"
          placeholder="p@ssw0rd!"
          type="password"
        />
        <p v-if="errors.password" class="text-sm text-red-600 mt-1">
          {{ errors.password }}
        </p>
      </div>
      <div>
        <Label for="password-confirm">パスワード確認</Label>
        <Input
          id="password-confirm"
          v-model="passwordConfirm"
          v-bind="passwordConfirmProps"
          placeholder="p@ssw0rd!"
          type="password"
        />
        <p v-if="errors.passwordConfirm" class="text-sm text-red-600 mt-1">
          {{ errors.passwordConfirm }}
        </p>
      </div>
      <div>
        <Label for="username">ユーザー名</Label>
        <Input
          id="username"
          v-model="username"
          v-bind="usernameProps"
          placeholder="username"
        />
        <p v-if="errors.username" class="text-sm text-red-600 mt-1">
          {{ errors.username }}
        </p>
      </div>
      <div class="flex items-start gap-2">
        <input
          id="termsAccepted"
          type="checkbox"
          v-model="termsAccepted"
          v-bind="termsAcceptedProps"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          :aria-invalid="!!errors.termsAccepted"
          :aria-describedby="errors.termsAccepted ? 'terms-error' : undefined"
        />
        <label class="text-sm leading-snug select-none">
          <span>
            <RouterLink
              to="/about/terms"
              class="underline font-medium"
              target="_blank"
              >利用規約</RouterLink
            >
            を読み、内容に同意します</span
          >
        </label>
      </div>
      <p
        v-if="errors.termsAccepted"
        id="terms-error"
        class="text-sm text-red-600 -mt-1"
      >
        {{ errors.termsAccepted }}
      </p>
      <div class="flex justify-center">
        <Button type="submit" :disabled="isSubmitting || !meta.valid">
          <span v-if="isSubmitting">登録中...</span>
          <span v-else>登録</span>
        </Button>
      </div>
    </form>
    <Separator />
    <div class="text-center">アカウントをお持ちの場合</div>
    <div class="flex justify-center">
      <Button>
        <router-link to="/signin"> ログイン </router-link>
      </Button>
    </div>
  </div>
</template>
