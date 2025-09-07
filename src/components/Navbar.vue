<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
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
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ChevronsDown, Menu } from "lucide-vue-next";
import GithubIcon from "@/icons/GithubIcon.vue";
import ToggleTheme from "./ToggleTheme.vue";
import { useAuth } from "@/composables/useAuth";
import { getCategories, type CategoryDto } from "@/api/auction";
import { useRoute } from "vue-router";

type NavAuth = "public" | "auth" | "guest";
interface RouteProps {
  to: string;
  label: string;
  auth?: NavAuth; // default 'public'
}

interface CategoryProps {
  to: string;
  name: string;
  description: string;
  activeItemCount: number;
}

const routeList: RouteProps[] = [
  {
    to: "/",
    label: "ホーム",
    auth: "public",
  },
  {
    to: "/signin",
    label: "ログイン",
    auth: "guest",
  },
  {
    to: "/signup",
    label: "会員登録",
    auth: "guest",
  },
  {
    to: "/mypage",
    label: "マイページ",
    auth: "auth",
  },
  {
    to: "/about",
    label: "オークションについて",
    auth: "public",
  },
];
const categoryList = ref<CategoryProps[]>([]);
const loadingCategories = ref(false);
const categoryError = ref<string | null>(null);

async function loadCategories() {
  loadingCategories.value = true;
  categoryError.value = null;
  try {
    const data = await getCategories();
    categoryList.value = data.map((c: CategoryDto) => ({
      to: `/search?categoryId=${c.id}`,
      name: c.name,
      description: c.description,
      activeItemCount: c.activeItemCount,
    }));
  } catch {
    categoryError.value = "カテゴリ取得失敗";
  } finally {
    loadingCategories.value = false;
  }
}

const isOpen = ref<boolean>(false);
const route = useRoute();
// desktop navigation menu re-render key to force close after navigation
const navMenuKey = ref(0);

const mode = useColorMode();

const { isAuthenticated, user } = useAuth();

onMounted(() => {
  loadCategories();
});

// ルート遷移時に自動で閉じる（カテゴリクリック後に開きっぱなし対策）
watch(
  () => route.fullPath,
  () => {
    if (isOpen.value) {
      isOpen.value = false;
    }
    navMenuKey.value++;
  }
);

function closeDesktopMenu() {
  try {
    const active = document.activeElement as HTMLElement | null;
    active?.blur?.();
  } catch {}
  navMenuKey.value++;
}

const visibleRouteList = computed(() => {
  return routeList.filter((item) => {
    const a = item.auth ?? "public";
    if (a === "public") return true;
    if (a === "auth") return !!isAuthenticated.value;
    if (a === "guest") return !isAuthenticated.value;
    return true;
  });
});
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
              <SheetClose as-child>
                <Button
                  as-child
                  variant="ghost"
                  class="justify-start text-base"
                >
                  <router-link to="/search"> すべてのカテゴリ </router-link>
                </Button>
              </SheetClose>
              <div class="flex flex-col gap-1 pl-5 justify-start">
                <div
                  v-if="loadingCategories"
                  class="px-4 text-sm text-muted-foreground"
                >
                  読み込み中...
                </div>
                <div
                  v-else-if="categoryError"
                  class="px-4 text-sm text-red-500"
                >
                  {{ categoryError }}
                </div>
                <SheetClose
                  v-else
                  v-for="{ to, name, activeItemCount } in categoryList"
                  :key="name"
                  as-child
                >
                  <Button
                    as-child
                    variant="ghost"
                    class="justify-start text-base"
                  >
                    <router-link :to="to">
                      {{ name }}
                      <span class="text-xs text-muted-foreground"
                        >({{ activeItemCount }})</span
                      >
                    </router-link>
                  </Button>
                </SheetClose>
              </div>
              <SheetClose
                v-for="{ to, label } in visibleRouteList"
                :key="label"
                as-child
              >
                <Button
                  as-child
                  variant="ghost"
                  class="justify-start text-base"
                >
                  <router-link :to="to">{{ label }}</router-link>
                </Button>
              </SheetClose>
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
    <NavigationMenu class="hidden lg:block" :key="navMenuKey">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger class="bg-card text-base">
            すべてのカテゴリ
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid w-[600px] grid-cols-2 gap-5 p-4">
              <ul class="flex flex-col gap-2">
                <li
                  v-if="loadingCategories"
                  class="p-3 text-sm text-muted-foreground"
                >
                  読み込み中...
                </li>
                <li v-else-if="categoryError" class="p-3 text-sm text-red-500">
                  {{ categoryError }}
                </li>
                <li
                  v-else
                  v-for="{ to, name, description } in categoryList"
                  :key="name"
                  class="rounded-md p-3 text-sm hover:bg-muted"
                >
                  <router-link :to="to" @click="closeDesktopMenu">
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
              v-for="{ to, label } in visibleRouteList"
              :key="label"
              as-child
              variant="ghost"
              class="justify-start text-base"
            >
              <router-link :to="to" @click="closeDesktopMenu">{{
                label
              }}</router-link>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="hidden lg:flex">
      <div class="flex items-center gap-2">
        <template v-if="isAuthenticated">
          <span class="text-sm text-muted-foreground">
            {{ user?.username }}
          </span>
          <Separator orientation="vertical" class="h-5" />
        </template>
      </div>
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
