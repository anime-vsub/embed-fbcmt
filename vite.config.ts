import path from "path"

import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vite"
import WindiCSS from "vite-plugin-windicss"



// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        {
          "@vueuse/router": ["useRouteQuery"],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "./dist-web"
  }
})
