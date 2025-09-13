<script setup lang="ts">
import { ChevronsDown } from "lucide-vue-next";
import Separator from "./ui/separator/Separator.vue";
</script>

<template>
  <footer id="footer" class="container pt-16 pb-6">
    <div class="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
      <div
        class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8"
      >
        <div class="col-span-full xl:col-span-2">
          <a href="#" class="flex font-bold items-center">
            <ChevronsDown
              class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white"
            />

            <h3 class="text-2xl">オークション</h3>
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">オークションについて</h3>

          <div>
            <RouterLink
              to="/about/what-is"
              class="opacity-60 hover:opacity-100"
            >
              オークションとは
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
            akina nakamori
          </a>
        </h3>
      </section>
    </div>
  </footer>
</template>
