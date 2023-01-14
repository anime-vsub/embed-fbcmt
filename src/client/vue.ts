import type { CODES, ERROR_CODES, Props } from "src/constants"
import { PENDING } from "src/constants"
import type { Ref } from "vue"
import { isRef, onBeforeUnmount, ref, watch } from "vue"

import { listenEvent, listenResize, setPropValue as setProp } from "./main"

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
  let cancelListenEvent: (() => void) | null = null
  if (!isRef(el)) el = ref(el)

  watch(
    el,
    (el) => {
      cancelListenEvent?.()
      loading.value = false
      error.value = undefined
      code.value = {
        code: PENDING.PENDING,
      }

      if (!el) return

      cancelListenEvent = listenEvent(el, (event) => {
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

  onBeforeUnmount(() => cancelListenEvent?.())

  return { code, loading, error }
}
export function useEmbedSize(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined
) {
  // eslint-disable-next-line functional/no-let
  let cancelResizWEvent: (() => void) | null = null
  // eslint-disable-next-line functional/no-let
  let cancelResizHEvent: (() => void) | null = null

  const width = ref(0)
  const height = ref(0)

  if (!isRef(el)) el = ref(el)

  watch(el, (el) => {
    cancelResizWEvent?.()
    cancelResizHEvent?.()

    if (!el) return

    cancelResizWEvent = listenResize(
      el,
      "width",
      (value) => (width.value = value)
    )
    cancelResizHEvent = listenResize(
      el,
      "height",
      (value) => (height.value = value)
    )
  })

  onBeforeUnmount(() => {
    cancelResizWEvent?.()
    cancelResizHEvent?.()
  })

  return { width, height }
}
export function useEmbedHeight(
  el: HTMLIFrameElement | Ref<HTMLIFrameElement | undefined> | undefined
) {
  // eslint-disable-next-line functional/no-let
  let cancelResizHEvent: (() => void) | null = null

  const height = ref(0)

  if (!isRef(el)) el = ref(el)

  watch(el, (el) => {
    cancelResizHEvent?.()

    if (!el) return

    cancelResizHEvent = listenResize(
      el,
      "height",
      (value) => (height.value = value)
    )
  })

  onBeforeUnmount(() => {
    cancelResizHEvent?.()
  })

  return height
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
export { listenResize }
