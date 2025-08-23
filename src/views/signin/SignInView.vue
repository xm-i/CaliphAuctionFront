<script lang="ts" setup>
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import Label from "@/components/ui/label/Label.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const router = useRouter();
const route = useRoute();
const { login, loading, error } = useAuth();

const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email({ message: "メールアドレスの形式が正しくありません" }),
    password: z.string().min(6, { message: "6文字以上で入力してください" }),
  })
);

const { handleSubmit, errors, defineField, meta } = useForm({
  validationSchema: schema,
  initialValues: { email: "", password: "" },
});

const [email, emailProps] = defineField("email");
const [password, passwordProps] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  await login(values);
  const redirect = (route.query.redirect as string) || { name: "home" };
  router.replace(redirect);
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
          autocomplete="email"
          placeholder="mail@example.com"
          :aria-invalid="!!errors.email"
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
          autocomplete="current-password"
          :aria-invalid="!!errors.password"
        />
        <p v-if="errors.password" class="text-sm text-red-600 mt-1">
          {{ errors.password }}
        </p>
      </div>
      <div class="flex justify-center">
        <Button type="submit" :disabled="loading || !meta.valid">
          <span v-if="loading">処理中...</span>
          <span v-else>ログイン</span>
        </Button>
      </div>
      <p v-if="error" class="text-sm text-red-700 text-center">{{ error }}</p>
    </form>
    <div>
      <a target="_blank" href="#"> 利用規約 </a>および
      <a target="_blank" href="#">プライバシーポリシー</a
      >に同意の上、ログインへお進みください。
    </div>
    <div class="text-right">ログインできない場合</div>
    <Separator />
    <div class="text-center">アカウントをお持ちでないですか？</div>
    <div class="flex justify-center">
      <Button>
        <router-link to="/signup"> 会員登録 </router-link>
      </Button>
    </div>
  </div>
</template>
