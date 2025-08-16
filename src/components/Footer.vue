<script setup lang="ts">
import { ChevronsDown } from "lucide-vue-next";
import Separator from "./ui/separator/Separator.vue";
</script>

<template>
  <footer id="footer" class="container py-24 pb-16 sm:py-32 sm:pb-24">
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
            <a href="#" class="opacity-60 hover:opacity-100">
              オークションとは
            </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> 会社概要 </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> 採用情報 </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> お知らせ </a>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">ヘルプ＆ガイド</h3>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> 配送について </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100">
              安心・安全への取り組み
            </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> 動作環境 </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100">
              お客様サポート
            </a>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">ポリシーと利用規約</h3>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100">
              プライバシーポリシー
            </a>
          </div>

          <div>
            <a href="#" class="opacity-60 hover:opacity-100"> 利用規約 </a>
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
