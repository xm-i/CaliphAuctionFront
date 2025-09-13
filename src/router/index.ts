import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/home/HomeView.vue";
import { useAuth } from "@/composables/useAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signin",
    name: "signin",
    component: () =>
      import(/* webpackChunkName: "signin" */ "../views/signin/SignInView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/signup/SignUpView.vue"),
  },
  {
    path: "/signup/success",
    name: "signup-success",
    component: () =>
      import(
        /* webpackChunkName: "signup-success" */ "../views/signup/SignUpSuccessView.vue"
      ),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/mypage",
    name: "mypage",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "mypage" */ "../views/mypage/MyPageView.vue"),
  },
  {
    path: "/mypage/won",
    name: "mypage-won",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "mypage-won" */ "../views/mypage/WonItemsView.vue"
      ),
  },
  {
    path: "/mypage/bidding",
    name: "mypage-bidding",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "mypage-bidding" */ "../views/mypage/BiddingItemsView.vue"
      ),
  },
  {
    path: "/mypage/charge",
    name: "mypage-charge",
    meta: { requiresAuth: true, blankLayout: true },
    component: () =>
      import(
        /* webpackChunkName: "points-charge" */ "../views/points/ChargePointsView.vue"
      ),
  },
  {
    path: "/points/complete",
    name: "points-complete",
    meta: { requiresAuth: true, blankLayout: true },
    component: () =>
      import(
        /* webpackChunkName: "points-complete" */ "../views/points/PurchaseCompleteView.vue"
      ),
  },
  {
    path: "/auction/:id",
    name: "auction-detail",
    component: () =>
      import(
        /* webpackChunkName: "auction-detail" */ "../views/auction/AuctionDetailView.vue"
      ),
    props: true,
  },
  {
    path: "/auction/:id/purchase",
    name: "auction-purchase",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "auction-purchase" */ "../views/auction/AuctionPurchaseView.vue"
      ),
    props: true,
  },
  {
    path: "/auction/:id/purchase/complete",
    name: "auction-purchase-complete",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "auction-purchase-complete" */ "../views/auction/AuctionPurchaseCompleteView.vue"
      ),
    props: true,
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/search/SearchView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // ブラウザの戻る/進むでは保存された位置を優先
    if (savedPosition) {
      return savedPosition;
    }
    // ハッシュがある場合は該当要素へ（存在しなければトップ）
    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
        behavior: "smooth",
      } as any;
    }
    // 通常遷移はページトップにリセット
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to) => {
  const { isAuthenticated, updateAuthenticatedStatus } = useAuth();
  updateAuthenticatedStatus();
  if (to.meta?.requiresAuth && !isAuthenticated.value) {
    return { name: "signin", query: { redirect: to.fullPath } };
  }
});

export default router;
