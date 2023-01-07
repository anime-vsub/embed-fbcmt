import "virtual:windi.css"
import "virtual:windi-devtools"

import { createApp } from "vue"

import App from "./App.vue"
import router from "./router/index"

createApp(App).use(router).mount("#app")
