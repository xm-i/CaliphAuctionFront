<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(10);
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      router.replace({ name: "signin" });
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-6 text-center">
    <h1 class="text-2xl font-semibold">登録が完了しました</h1>
    <p class="text-muted-foreground">
      ログイン画面に遷移してログインしてください。
    </p>
    <p class="text-sm text-muted-foreground">
      {{ countdown }} 秒後に自動で遷移します。
    </p>
    <div class="pt-4">
      <Button as-child>
        <router-link :to="{ name: 'signin' }">ログインへ</router-link>
      </Button>
    </div>
  </div>
</template>
