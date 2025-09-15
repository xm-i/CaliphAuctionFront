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
    meta: { title: "サインイン" },
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/signup/SignUpView.vue"),
    meta: { title: "会員登録" },
  },
  {
    path: "/signup/success",
    name: "signup-success",
    component: () =>
      import(
        /* webpackChunkName: "signup-success" */ "../views/signup/SignUpSuccessView.vue"
      ),
    meta: { title: "登録完了" },
  },
  // About section detail pages
  {
    path: "/about/what-is",
    name: "about-what",
    component: () =>
      import(
        /* webpackChunkName: "about-what" */ "../views/about/AuctionAboutView.vue"
      ),
    meta: { title: "カリフオークションとは" },
  },
  {
    path: "/about/company",
    name: "about-company",
    component: () =>
      import(
        /* webpackChunkName: "about-company" */ "../views/about/CompanyProfileView.vue"
      ),
    meta: { title: "会社概要" },
  },
  {
    path: "/about/careers",
    name: "about-careers",
    component: () =>
      import(
        /* webpackChunkName: "about-careers" */ "../views/about/CareersView.vue"
      ),
    meta: { title: "採用情報" },
  },
  {
    path: "/about/news",
    name: "about-news",
    component: () =>
      import(
        /* webpackChunkName: "about-news" */ "../views/about/NewsView.vue"
      ),
    meta: { title: "お知らせ" },
  },
  {
    path: "/about/shipping",
    name: "about-shipping",
    component: () =>
      import(
        /* webpackChunkName: "about-shipping" */ "../views/about/ShippingInfoView.vue"
      ),
    meta: { title: "配送について" },
  },
  {
    path: "/about/safety",
    name: "about-safety",
    component: () =>
      import(
        /* webpackChunkName: "about-safety" */ "../views/about/SafetyInitiativesView.vue"
      ),
    meta: { title: "安心・安全への取り組み" },
  },
  {
    path: "/about/system-requirements",
    name: "about-system-requirements",
    component: () =>
      import(
        /* webpackChunkName: "about-system-requirements" */ "../views/about/SystemRequirementsView.vue"
      ),
    meta: { title: "動作環境" },
  },
  {
    path: "/about/support",
    name: "about-support",
    component: () =>
      import(
        /* webpackChunkName: "about-support" */ "../views/about/SupportView.vue"
      ),
    meta: { title: "お客様サポート" },
  },
  {
    path: "/about/privacy",
    name: "about-privacy",
    component: () =>
      import(
        /* webpackChunkName: "about-privacy" */ "../views/about/PrivacyPolicyView.vue"
      ),
    meta: { title: "プライバシーポリシー" },
  },
  {
    path: "/about/terms",
    name: "about-terms",
    component: () =>
      import(
        /* webpackChunkName: "about-terms" */ "../views/about/TermsOfServiceView.vue"
      ),
    meta: { title: "利用規約" },
  },
  {
    path: "/mypage",
    name: "mypage",
    meta: { requiresAuth: true, title: "マイページ" },
    component: () =>
      import(/* webpackChunkName: "mypage" */ "../views/mypage/MyPageView.vue"),
  },
  {
    path: "/mypage/won",
    name: "mypage-won",
    meta: { requiresAuth: true, title: "落札履歴" },
    component: () =>
      import(
        /* webpackChunkName: "mypage-won" */ "../views/mypage/WonItemsView.vue"
      ),
  },
  {
    path: "/mypage/bidding",
    name: "mypage-bidding",
    meta: { requiresAuth: true, title: "入札中アイテム" },
    component: () =>
      import(
        /* webpackChunkName: "mypage-bidding" */ "../views/mypage/BiddingItemsView.vue"
      ),
  },
  {
    path: "/mypage/charge",
    name: "mypage-charge",
    meta: { requiresAuth: true, blankLayout: true, title: "ポイントチャージ" },
    component: () =>
      import(
        /* webpackChunkName: "points-charge" */ "../views/points/ChargePointsView.vue"
      ),
  },
  {
    path: "/points/complete",
    name: "points-complete",
    meta: { requiresAuth: true, blankLayout: true, title: "ポイント購入完了" },
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
    meta: { title: "オークション詳細" },
  },
  {
    path: "/auction/:id/purchase",
    name: "auction-purchase",
    meta: { requiresAuth: true, title: "購入手続き" },
    component: () =>
      import(
        /* webpackChunkName: "auction-purchase" */ "../views/auction/AuctionPurchaseView.vue"
      ),
    props: true,
  },
  {
    path: "/auction/:id/purchase/complete",
    name: "auction-purchase-complete",
    meta: { requiresAuth: true, title: "購入完了" },
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
    meta: { title: "検索" },
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

// Set document title after navigation
const BASE_TITLE = "カリフオークション | ライブ型ペニーオークション";
router.afterEach((to) => {
  const routeTitle = (to.meta && (to.meta as any).title) as string | undefined;
  if (routeTitle) {
    document.title = `${routeTitle} | ${BASE_TITLE}`;
  } else {
    document.title = BASE_TITLE;
  }
});

export default router;
