<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import { preRegister } from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "registered"): void;
}>();

const authStore = useAuthStore();

const schema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(3, { message: "3文字以上で入力してください" })
      .max(50, { message: "50文字以下で入力してください" }),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, { message: "利用規約に同意してください" }),
  }),
);

const { defineField, handleSubmit, errors, meta, isSubmitting, resetForm } =
  useForm({
    validationSchema: schema,
    initialValues: {
      username: "",
      termsAccepted: false,
    },
  });

const [username, usernameProps] = defineField("username");
const [termsAccepted, termsAcceptedProps] = defineField("termsAccepted");

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await preRegister({ username: values.username });
    // Auto-login with returned credentials
    await authStore.login({
      userId: res.userId,
      password: res.password,
    });
    emit("update:open", false);
    emit("registered");
  } catch (e: any) {
    // Error is handled by the store's login method
  }
});

function onOpenChange(value: boolean) {
  if (!value) {
    resetForm();
  }
  emit("update:open", value);
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="onOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>仮会員登録</AlertDialogTitle>
        <AlertDialogDescription>
          ユーザー名を入力して仮会員登録を行ってください。
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <Label for="pre-register-username">ユーザー名</Label>
          <Input
            id="pre-register-username"
            v-model="username"
            v-bind="usernameProps"
            placeholder="ユーザー名を入力"
            :disabled="isSubmitting"
          />
          <p v-if="errors.username" class="text-sm text-destructive">
            {{ errors.username }}
          </p>
        </div>

        <div class="flex items-start gap-2">
          <input
            id="pre-register-terms"
            type="checkbox"
            v-model="termsAccepted"
            v-bind="termsAcceptedProps"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            :disabled="isSubmitting"
            :aria-invalid="!!errors.termsAccepted"
            :aria-describedby="
              errors.termsAccepted ? 'pre-register-terms-error' : undefined
            "
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
          id="pre-register-terms-error"
          class="text-sm text-destructive -mt-2"
        >
          {{ errors.termsAccepted }}
        </p>

        <Button
          type="submit"
          class="w-full"
          :disabled="isSubmitting || !meta.valid"
        >
          {{ isSubmitting ? "登録中..." : "登録" }}
        </Button>
      </form>

      <p class="text-sm text-muted-foreground text-center mt-2">
        すでにアカウントをお持ちの方は<RouterLink
          to="/signin"
          class="underline text-primary hover:text-primary/80"
          @click="onOpenChange(false)"
          >ログイン</RouterLink
        >してください。
      </p>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isSubmitting">閉じる</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
