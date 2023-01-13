import type { CODES, ERROR_CODES } from "src/constants"
import { PENDING } from "src/constants"
import type { Ref } from "vue"
import { isRef, onBeforeUnmount, ref, watch } from "vue"

import { listenEvent, setPropValue } from "./main"

export function useEmbed(el: HTMLIFrameElement | Ref<HTMLIFrameElement>) {
  const code = ref<{
    code: CODES | PENDING
    message?: string
  }>({
    code: PENDING.PENDING,
  })

  const loading = ref(false)
  const error = ref<
    Error & {
      code: ERROR_CODES
    }
  >()

  // eslint-disable-next-line functional/no-let
  let cancel: (() => void) | null = null

  if (!isRef(el)) el = ref(el)

  watch(
    el,
    (el) => {
      cancel?.()
      loading.value = false
      error.value = undefined
      code.value = {
        code: PENDING.PENDING,
      }

      if (!el) return

      cancel = listenEvent(el, (event) => {
        code.value = event
        if (event.type === "loading") {
          error.value = undefined
          loading.value = true
        } else if (event.type === "error") {
          loading.value = false
          error.value = Object.assign(new Error(event.message), {
            code: event.type,
          }) as unknown as Error & { code: ERROR_CODES }
        } else {
          loading.value = false
          error.value = undefined
        }
      })
    },
    { immediate: true }
  )

  onBeforeUnmount(() => cancel?.())

  return { code, loading, error }
}
export { setPropValue }
