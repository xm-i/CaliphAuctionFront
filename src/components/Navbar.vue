<script lang="ts" setup>
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ChevronsDown, Menu } from "lucide-vue-next";
import GithubIcon from "@/icons/GithubIcon.vue";
import ToggleTheme from "./ToggleTheme.vue";

interface RouteProps {
  to: string;
  label: string;
}

interface CategoryProps {
  to: string;
  name: string;
  description: string;
}

const routeList: RouteProps[] = [
  {
    to: "/",
    label: "ホーム",
  },
  {
    to: "/User",
    label: "会員登録",
  },
  {
    to: "/MyPage",
    label: "マイページ",
  },
  {
    to: "/Watch",
    label: "ウォッチ",
  },
  {
    to: "/About",
    label: "オークションについて",
  },
];
const categoryList: CategoryProps[] = [
  {
    to: "/Category1",
    name: "category1",
    description: "category 1",
  },
  {
    to: "/Category2",
    name: "category2",
    description: "category 2",
  },
  {
    to: "/Category3",
    name: "category3",
    description: "category 3",
  },
];

const isOpen = ref<boolean>(false);

const mode = useColorMode();
</script>

<template>
  <header
    :class="{
      'shadow-light': mode === 'light',
      'shadow-dark': mode === 'dark',
      'w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md': true,
    }"
  >
    <a href="/" class="font-bold text-lg flex items-center">
      <ChevronsDown
        class="bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white"
      />
      オークション</a
    >
    <!-- Mobile -->
    <div class="flex items-center lg:hidden">
      <Sheet v-model:open="isOpen">
        <SheetTrigger as-child>
          <Menu @click="isOpen = true" class="cursor-pointer"></Menu>
        </SheetTrigger>

        <SheetContent
          side="left"
          class="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card"
        >
          <div>
            <SheetHeader class="mb-4 ml-4">
              <SheetTitle class="flex items-center">
                <a href="/" class="flex items-center">
                  <ChevronsDown
                    class="bg-gradient-to-tr from-primary/70 via-primary to-primary/70 rounded-lg size-9 mr-2 border text-white"
                  />
                  オークション
                </a>
              </SheetTitle>
            </SheetHeader>

            <div class="flex flex-col gap-1">
              <Button as-child variant="ghost" class="justify-start text-base">
                <router-link @click="isOpen = false" to="a">
                  すべてのカテゴリ
                </router-link>
              </Button>
              <div class="flex flex-col gap-1 pl-5 justify-start">
                <Button
                  v-for="{ to, name } in categoryList"
                  :key="name"
                  as-child
                  variant="ghost"
                  class="justify-start text-base"
                >
                  <router-link @click="isOpen = false" :to="to">
                    {{ name }}
                  </router-link>
                </Button>
              </div>
              <Button
                v-for="{ to, label } in routeList"
                :key="label"
                as-child
                variant="ghost"
                class="justify-start text-base"
              >
                <router-link @click="isOpen = false" :to="to">
                  {{ label }}
                </router-link>
              </Button>
            </div>
          </div>

          <SheetFooter class="flex-col sm:flex-col justify-start items-start">
            <Separator class="mb-2" />

            <ToggleTheme />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <NavigationMenu class="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger class="bg-card text-base">
            すべてのカテゴリ
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid w-[600px] grid-cols-2 gap-5 p-4">
              <ul class="flex flex-col gap-2">
                <li
                  v-for="{ to, name, description } in categoryList"
                  :key="name"
                  class="rounded-md p-3 text-sm hover:bg-muted"
                >
                  <router-link :to="to">
                    <p class="mb-1 font-semibold leading-none text-foreground">
                      {{ name }}
                    </p>
                    <p class="line-clamp-2 text-muted-foreground">
                      {{ description }}
                    </p>
                  </router-link>
                </li>
              </ul>
              <img
                src="https://www.radix-vue.com/logo.svg"
                alt="Beach"
                class="h-full w-full rounded-md object-cover"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Button
              v-for="{ to, label } in routeList"
              :key="label"
              as-child
              variant="ghost"
              class="justify-start text-base"
            >
              <router-link :to="to">
                {{ label }}
              </router-link>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="hidden lg:flex">
      <ToggleTheme />

      <Button as-child size="sm" variant="ghost" aria-label="View on GitHub">
        <a
          aria-label="View on GitHub"
          href="https://github.com/southernwind/PennyAuctionFront"
          target="_blank"
        >
          <GithubIcon class="size-5" />
        </a>
      </Button>
    </div>
  </header>
</template>

<style scoped>
.shadow-light {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
}

.shadow-dark {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
}
</style>
