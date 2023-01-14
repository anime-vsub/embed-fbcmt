import type {
  CODES,
  Param__emit__fb_embed,
  Param__req__fb_set_value,
  Param__update_size,
  Param_res__fb_set_value,
  Props,
} from "src/constants"
import { ERROR_CODES } from "src/constants"

export function setPropValue(
  el: HTMLIFrameElement,
  props: Partial<Props>,
  origin?: string
): Promise<void>
export function setPropValue<T extends keyof Props>(
  el: HTMLIFrameElement,
  prop: T,
  value: Props[T],
  origin?: string
): Promise<void>
export function setPropValue(
  el: HTMLIFrameElement,
  prop: keyof Props | Partial<Props>,
  value: unknown,
  origin?: string
): Promise<void> {
  if (origin === undefined) {
    // 3 paraments
    origin = value as string
    // prop is object
    value = undefined
  }

  return new Promise<void>((resolve, reject) => {
    const id = (Number.MAX_SAFE_INTEGER * Math.random()).toString(34)

    const handler = (event: MessageEvent<Param_res__fb_set_value>) => {
      if (event.data?.type === "res::fb:set_value" && id === event.data.id) {
        const { code } = event.data

        if (typeof code !== "string") return

        if (code.startsWith("success.")) resolve()
        else if (code.startsWith("error."))
          reject(Object.assign(new Error(code), { prop }))
        else console.warn("[res::fb:set_value]: invalid code error '%s'", code)

        cancel()
      }
    }
    // eslint-disable-next-line functional/no-let
    let timeout: number | NodeJS.Timeout | null = null
    const cancel = () => {
      if (timeout) clearTimeout(timeout)
      window.removeEventListener("message", handler)
    }

    window.addEventListener("message", handler)
    timeout = setTimeout(() => {
      cancel()
      reject(new Error(ERROR_CODES.ERROR_TIMEOUT))
    }, 30_000)

    const res: Param__req__fb_set_value = {
      id,
      type: "req::fb:set_value",
      props: typeof prop === "object" ? prop : { [prop]: value },
    }

    if (el.contentWindow) el.contentWindow.postMessage(res, origin ?? "*")
    else reject()
  })
}
export function listenEvent(
  el: HTMLIFrameElement,
  cb: (event: {
    type: "success" | "loading" | "error"
    code: CODES
    message: string
  }) => void
): () => void {
  const handler = (event: MessageEvent<Param__emit__fb_embed>) => {
    if (event.source !== el.contentWindow) return
    if (event.data?.type !== "emit::fb_embed") return

    const typeCode = getTypeCode(event.data.code)

    if (!typeCode) return

    // eslint-disable-next-line n/no-callback-literal
    cb({
      type: typeCode,
      code: event.data.code,
      message: event.data.message,
    })
  }
  window.addEventListener("message", handler)

  return () => window.removeEventListener("message", handler)
}
export function listenResize(
  el: HTMLIFrameElement,
  type: "width" | "height",
  cb: (size: number) => void
): () => void {
  const handler = (event: MessageEvent<Param__update_size>) => {
    if (event.source !== el.contentWindow) return
    if (event.data?.type !== `update::fb_${type}`) return

    cb(event.data.value)
  }
  window.addEventListener("message", handler)

  return () => window.removeEventListener("message", handler)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTypeCode(code: any) {
  if (code.startsWith("success.")) return "success"
  if (code.startsWith("loading.")) return "loading"
  if (code.startsWith("error.")) return "error"

  return null
}
