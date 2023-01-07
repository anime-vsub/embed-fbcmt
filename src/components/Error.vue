<template>
  <teleport to="body">
    <div
      class="fixed top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center"
      :style="{
        'background-color': bg,
        color: text,
      }"
    >
      <div
        class="w-[90%] max-w-[720px] h-[80%] max-h-[810px] bg-[#181818] rounded-[20px] flex flex-col items-center justify-center"
        style="
          box-shadow: 0 19px 38px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
        "
      >
        <Icon icon="bx:error" width="40" height="40" />
        <div class="text-subtitle1">
          {{ code }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import { useRouteQuery } from "@vueuse/router"
import { CODES } from "src/constants"

defineProps<{
  code: CODES
}>()

const bg = useRouteQuery("loader_bg", "rgba(0,0,0,0.8)")
const text = useRouteQuery("loader_text", "white")
</script>
