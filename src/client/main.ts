import {
  Props,
  Param__req__fb_set_value,
  CODES,
  Param__emit__fb_embed,
  Param_res__fb_set_value,
} from "src/constants"

export function setPropValue<T extends keyof Props>(
  el: HTMLIFrameElement,
  prop: T,
  value: Props[T]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const handler = (event: MessageEvent<Param_res__fb_set_value>) => {
      if (event.data?.type === "res::fb:set_value") {
        const { code, data } = event.data

        if (typeof code !== "string") return

        if (code.startsWith("success.")) resolve()
        else if (code.startsWith("error."))
          reject(Object.assign(new Error(code), { prop: data }))
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

    if (el.contentWindow) el.contentWindow.postMessage(res, "*")
    else reject()
  })
}
export function listenEvent(
  el: HTMLIFrameElement,
  cb: (event: { type: "success" | "loading" | "error"; code: CODES }) => void
): () => void {
  const handler = (event: MessageEvent<Param__emit__fb_embed>) => {
    if (event.source !== el.contentWindow) return
    if (event.data?.type !== "emit::fb_embed") return

    const typeCode = getTypeCode(event.data.code)

    if (!typeCode) return

    cb({
      type: typeCode,
      code: event.data.code,
    })
  }
  window.addEventListener("message", handler)

  return () => window.removeEventListener("message", handler)
}

export function getTypeCode(code: any) {
  if (code.startsWith("success.")) return "success"
  if (code.startsWith("loading.")) return "loading"
  if (code.startsWith("error.")) return "error"

  return null
}
