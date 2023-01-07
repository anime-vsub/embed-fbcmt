import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"

// https://vitejs.dev/config/
export default defineConfig({
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
        'src': path.resolve(__dirname, './src'),
      },
    }
})
