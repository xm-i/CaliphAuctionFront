<script setup lang="ts">
import Separator from "./ui/separator/Separator.vue";
import logoKalif from "@/assets/logo-kalif.svg";
</script>

<template>
  <footer id="footer" class="container pt-16 pb-6">
    <div class="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
      <div
        class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8"
      >
        <div class="col-span-full xl:col-span-2">
          <a
            href="/"
            class="flex font-bold items-center group"
            aria-label="カリフオークション ホーム"
          >
            <img
              :src="logoKalif"
              alt="カリフオークション ロゴ"
              class="w-9 h-9 mr-2 rounded-xl border border-border/40 shadow-inner shadow-primary/30 bg-gradient-to-tr from-primary via-accent to-primary p-1 object-contain group-hover:rotate-3 transition-transform duration-300"
              decoding="async"
              loading="lazy"
            />
            <h3
              class="text-2xl text-gradient-primary tracking-tight group-hover:opacity-90 transition-opacity"
            >
              カリフオークション
            </h3>
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">カリフオークションについて</h3>

          <div>
            <RouterLink
              to="/about/what-is"
              class="opacity-60 hover:opacity-100"
            >
              カリフオークションとは
            </RouterLink>
          </div>

          <div>
            <RouterLink
              to="/about/company"
              class="opacity-60 hover:opacity-100"
            >
              会社概要
            </RouterLink>
          </div>

          <div>
            <RouterLink
              to="/about/careers"
              class="opacity-60 hover:opacity-100"
            >
              採用情報
            </RouterLink>
          </div>

          <div>
            <RouterLink to="/about/news" class="opacity-60 hover:opacity-100">
              お知らせ
            </RouterLink>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">ヘルプ＆ガイド</h3>

          <div>
            <RouterLink
              to="/about/shipping"
              class="opacity-60 hover:opacity-100"
            >
              配送について
            </RouterLink>
          </div>

          <div>
            <RouterLink to="/about/safety" class="opacity-60 hover:opacity-100">
              安心・安全への取り組み
            </RouterLink>
          </div>

          <div>
            <RouterLink
              to="/about/system-requirements"
              class="opacity-60 hover:opacity-100"
            >
              動作環境
            </RouterLink>
          </div>

          <div>
            <RouterLink
              to="/about/support"
              class="opacity-60 hover:opacity-100"
            >
              お客様サポート
            </RouterLink>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">ポリシーと利用規約</h3>

          <div>
            <RouterLink
              to="/about/privacy"
              class="opacity-60 hover:opacity-100"
            >
              プライバシーポリシー
            </RouterLink>
          </div>

          <div>
            <RouterLink to="/about/terms" class="opacity-60 hover:opacity-100">
              利用規約
            </RouterLink>
          </div>
        </div>
      </div>

      <Separator class="my-6" />
      <section className="">
        <h3 class="">
          &copy; 2025 developed by
          <a
            target="_blank"
            href="https://github.com/southernwind"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            nakamori
          </a>
        </h3>
      </section>
    </div>
  </footer>
</template>
