import type { RouteRecordRaw } from "vue-router"

export const routes: RouteRecordRaw[] = [
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/index.vue"),
  },
]
