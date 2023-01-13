import type {
  CODES,
  Param__emit__fb_embed,
  Param__req__fb_set_value,
  Param_res__fb_set_value,
  Props,
} from "src/constants"

export function setPropValue<T extends keyof Props>(
  el: HTMLIFrameElement,
  prop: T,
  value: Props[T],
  origin = "*"
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const handler = (event: MessageEvent<Param_res__fb_set_value>) => {
      if (event.data?.type === "res::fb:set_value") {
        const { code, prop } = event.data

        if (typeof code !== "string") return

        if (code.startsWith("success.")) resolve()
        else if (code.startsWith("error."))
          reject(Object.assign(new Error(code), { prop }))
        else console.warn("[res::fb:set_value]: invalid code error '%s'", code)

        window.removeEventListener("message", handler)
      }
    }

    window.addEventListener("message", handler)
    const res: Param__req__fb_set_value<T> = {
      type: "req::fb:set_value",
      prop,
      val: value,
    }

    if (el.contentWindow) el.contentWindow.postMessage(res, origin)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTypeCode(code: any) {
  if (code.startsWith("success.")) return "success"
  if (code.startsWith("loading.")) return "loading"
  if (code.startsWith("error.")) return "error"

  return null
}
