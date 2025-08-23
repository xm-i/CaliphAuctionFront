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
    path: "/auction/:id",
    name: "auction-detail",
    component: () =>
      import(
        /* webpackChunkName: "auction-detail" */ "../views/auction/AuctionDetailView.vue"
      ),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.meta?.requiresAuth && !isAuthenticated.value) {
    return { name: "signin", query: { redirect: to.fullPath } };
  }
});

export default router;
