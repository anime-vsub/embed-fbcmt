import type { CODES, ERROR_CODES, Props } from "src/constants"
import { PENDING } from "src/constants"
import type { Ref } from "vue"
import { isRef, onBeforeUnmount, ref, watch } from "vue"

import { listenEvent, setPropValue as setProp } from "./main"

export function useEmbed(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined
) {
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

export async function setPropValue(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined,
  props: Partial<Props>,
  origin?: string
): Promise<void>
export async function setPropValue<T extends keyof Props>(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined,
  prop: T,
  value: Props[T],
  origin?: string
): Promise<void>
export async function setPropValue(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined,
  prop: keyof Props | Partial<Props>,
  value: unknown,
  origin?: string
): Promise<void> {
  if (isRef(el)) el = el.value

  if (el) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await setProp(el, prop as unknown as any, value, origin as unknown as any)
  }
}

export { default as EmbedFbCmt } from "./EmbedFbCmt"
