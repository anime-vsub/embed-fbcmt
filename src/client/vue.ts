import type { CODES } from "src/constants"
import type { Ref} from "vue";
import { isRef, onBeforeUnmount, ref, watch } from "vue"

import { listenEvent, setPropValue } from "./main"

export function useEmbed(el: HTMLIFrameElement | Ref<HTMLIFrameElement>) {
  const code = ref<CODES | null>(null)

  const loading = ref(false)
  const error = ref(false)

  let cancel: (() => void) | null = null

  if (!isRef(el)) el = ref(el)

  watch(
    el,
    (el) => {
      cancel?.()
      loading.value = error.value = false

      if (!el) return

      cancel = listenEvent(el, (event) => {
        code.value = event.code
        if (event.type === "loading") {
          error.value = false
          loading.value = true
        } else if (event.type === "error") {
          loading.value = false
          error.value = true
        } else {
          error.value = loading.value = false
        }
      })
    },
    { immediate: true }
  )

  onBeforeUnmount(() => cancel?.())

  return { code, loading, error }
}
export { setPropValue }
