import path from "path"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import WindiCSS from "vite-plugin-windicss"

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    WindiCSS()
  ],
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "./src"),
    },
  }
})
