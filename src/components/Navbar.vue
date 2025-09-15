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

import { Menu } from "lucide-vue-next";
import logoCaliph from "@/assets/logo-caliph.svg";
import GithubIcon from "@/icons/GithubIcon.vue";
import LogoutIcon from "@/icons/LogoutIcon.vue";
import ToggleTheme from "./ToggleTheme.vue";
import { useAuth } from "@/composables/useAuth";
import { usePointsBalanceStore } from "@/stores/pointsBalance";
import { getCategories, type CategoryDto } from "@/api/auction";
import { useRoute } from "vue-router";
import MascotImage from "@/components/MascotImage.vue";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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
    to: "/about/what-is",
    label: "カリフオークションについて",
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

const { isAuthenticated, logout } = useAuth();
const pointsStore = usePointsBalanceStore();

onMounted(() => {
  pointsStore.updateBalanceFromApi();
});

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

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <header
    :class="{
      'shadow-light': mode === 'light',
      'shadow-dark': mode === 'dark',
      'w-[92%] md:w-[78%] lg:w-[76%] xl:max-w-screen-xl top-4 mx-auto sticky z-40 flex justify-between items-center px-4 py-2 rounded-2xl glass elevation-1 soft-transition': true,
    }"
  >
    <a
      href="/"
      class="font-bold text-lg flex items-center group"
      aria-label="カリフオークション ホーム"
    >
      <img
        :src="logoCaliph"
        alt="カリフオークション ロゴ"
        class="w-9 h-9 mr-2 rounded-xl border border-border/40 shadow-inner shadow-primary/30 bg-gradient-to-tr from-primary via-accent to-primary p-1 object-contain group-hover:rotate-3 transition-transform duration-300"
        decoding="async"
        loading="lazy"
      />
      <span
        class="text-gradient-primary tracking-tight group-hover:opacity-90 transition-opacity"
        >カリフオークション</span
      >
    </a>
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
                  <img
                    :src="logoCaliph"
                    alt="カリフオークション ロゴ"
                    class="size-9 mr-2 rounded-lg border border-border/40 bg-gradient-to-tr from-primary/70 via-primary to-primary/70 p-1 object-contain"
                  />
                  カリフオークション
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
            <div v-if="isAuthenticated" class="w-full mb-2">
              <SheetClose as-child>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button
                      type="button"
                      variant="secondary"
                      class="w-full justify-center text-sm font-medium"
                    >
                      <LogoutIcon class="size-5" />ログアウト
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
                      <AlertDialogDescription>
                        ログアウトしますが、よろしいですか。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction @click="logout()"
                        >ログアウト</AlertDialogAction
                      >
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetClose>
            </div>
            <ToggleTheme />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <NavigationMenu class="hidden lg:block" :key="navMenuKey">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            class="text-sm font-medium rounded-md px-3 py-2 soft-transition relative text-slate-700 dark:text-foreground hover:text-slate-900 dark:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:origin-center after:scale-x-0 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
          >
            すべてのカテゴリ
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid w-[640px] grid-cols-2 gap-6 p-5 card-surface">
              <ul class="flex flex-col gap-1">
                <li
                  v-if="loadingCategories"
                  class="p-3 text-sm text-muted-foreground animate-pulse"
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
                  class="rounded-lg p-3 text-sm soft-transition hover-raise border border-transparent hover:border-border/60 hover:bg-muted/60 dark:hover:bg-muted/40 hover:text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <router-link :to="to" @click="closeDesktopMenu">
                    <p
                      class="mb-1 font-semibold leading-none text-foreground/90"
                    >
                      {{ name }}
                    </p>
                    <p
                      class="line-clamp-2 text-muted-foreground text-xs leading-snug"
                    >
                      {{ description }}
                    </p>
                  </router-link>
                </li>
              </ul>
              <MascotImage mood="smiling" size="100%" />
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
              :class="[
                'justify-start text-sm font-medium soft-transition relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden hover:bg-transparent active:bg-transparent focus:bg-transparent',
                'after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300',
                isActive(to)
                  ? 'text-slate-900 dark:text-foreground hover:text-slate-900 dark:hover:text-foreground after:scale-x-100 after:opacity-100'
                  : 'text-slate-600 dark:text-foreground/80 hover:text-slate-900 dark:hover:text-foreground after:opacity-90',
              ]"
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
      <div class="flex items-center gap-3">
        <template v-if="isAuthenticated">
          <span
            v-if="pointsStore.balance != null"
            class="text-xs font-semibold tracking-wide bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1"
          >
            <span class="opacity-70 font-normal">🪙</span>
            {{ pointsStore.balance!.toLocaleString() }}
            <Button
              size="xs"
              variant="ghost"
              class="ml-1 text-[10px] h-auto px-1 py-0.5 rounded soft-transition disabled:opacity-40"
              :disabled="pointsStore.loading"
              @click.stop="pointsStore.updateBalanceFromApi()"
              title="残高更新"
            >
              <span v-if="!pointsStore.loading">⟳</span>
              <span v-else class="inline-block animate-spin">⟳</span>
            </Button>
          </span>
          <Separator orientation="vertical" class="h-5" />
        </template>
      </div>
      <ToggleTheme />

      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button
            v-if="isAuthenticated"
            size="sm"
            variant="ghost"
            aria-label="ログアウト"
            class="ml-3 font-medium text-xs h-8 px-3 soft-transition hover:bg-muted/60 dark:hover:bg-muted/40"
          >
            <LogoutIcon class="size-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ログアウト確認</AlertDialogTitle>
            <AlertDialogDescription>
              ログアウトしますが、よろしいですか。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction @click="logout()">ログアウト</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        as-child
        size="sm"
        variant="ghost"
        aria-label="View on GitHub"
        class="soft-transition hover:bg-muted/60 dark:hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <a
          aria-label="View on GitHub"
          href="https://github.com/southernwind/CaliphAuctionFront"
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
