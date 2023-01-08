import { createRouter, createMemoryHistory } from "vue-router"

import { routes } from "./routes"

export default createRouter({
  history: createMemoryHistory(),
  routes,
})
