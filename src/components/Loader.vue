<template>
  <teleport to="body">
    <div
      class="fixed top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center"
      :style="{
        'background-color': bg,
        color: text,
      }"
    >
      <Icon icon="eos-icons:loading" width="40" height="40" style="color: inherit" />
      <div class="text-subtitle1">
        {{ t(lang, code) }}
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useRouteQuery } from "@vueuse/router"
import type { CODES } from "src/constants"
import { t } from "src/i18n"

defineProps<{
  lang: string
  code: CODES
}>()

const bg = useRouteQuery("loader_bg", "rgba(0,0,0,0.8)")
const text = useRouteQuery("loader_text", "white")
</script>
