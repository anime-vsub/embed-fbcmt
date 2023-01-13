<template>
  <div
    v-if="active"
    class="fb-comments"
    :data-colorscheme="colorScheme"
    :data-href="href"
    :data-lazy="lazy"
    :data-mobile="mobile"
    :data-numposts="numPosts"
    :data-order-by="orderBy"
    data-width="100%"
  />

  <template v-if="active && !noPopup">
    <Loader v-if="typeCode === 'loading'" :code="code!" :lang="language" />
    <Error v-if="typeCode === 'error'" :code="code!" :lang="language" />
  </template>
</template>

<script lang="ts" setup>
import { useEventListener } from "@vueuse/core"
import Error from "src/components/Error.vue"
import Loader from "src/components/Loader.vue"
import { useQuery } from "src/composibles/useQuery"
import type {
  CODES,
  Param__emit__fb_embed,
  Param__req__fb_set_value,
  Param_res__fb_set_value,
  Props,
} from "src/constants"
import {
  ERROR_CODES,
  LOADING_CODES,
  SET_VAL_CODES,
  SUCCESS_CODES,
} from "src/constants"
import { t } from "src/i18n"
import { loadFBSdk } from "src/logic/load-fb-sdk"
import type { WritableComputedRef } from "vue";
import { computed, ref, watch } from "vue"
import type { LocationQueryValue } from "vue-router"

function assertBool(
  v:
    | string
    | NonNullable<boolean | void>
    | boolean
    | LocationQueryValue[]
    | null
) {
  if (Array.isArray(v)) v = v[0]

  switch (v) {
    case "true":
      return true
    case "false":
      return false
  }
}

const code = ref<CODES | null>(null)
const typeCode = computed<"success" | "loading" | "error" | null>(() => {
  if (!code.value) return null

  return (code.value as string).slice(
    0,
    (code.value as string).indexOf(".")
  ) as "success" | "loading" | "error"
})

const colorScheme = useQuery<"dark" | "light">("color_scheme", "light", (v) =>
  v === "dark" || v === "light" ? v : undefined
)
const href = useQuery("href", "", (v) => (Array.isArray(v) ? v[0] : v)) // ref<string>()
const lazy = useQuery("lazy", false, assertBool) // ref(false)
const mobile = useQuery<boolean | undefined>("mobile", undefined, assertBool) // ref<void | boolean>()
const numPosts = useQuery("num_posts", 10, (v) => {
  if (Array.isArray(v)) v = v[0]

  const n = parseInt(v + "")

  if (Number.isNaN(n)) return

  return n
}) // ref(10)
const orderBy = useQuery<"time" | "reverse_time">(
  "order_by",
  "reverse_time",
  (v) => {
    if (Array.isArray(v)) v = v[0]

    if (v === "time" || v === "reverse_time") return v
  }
)
const language = useQuery(
  "lang",
  "en_US",
  (v) =>
    (Array.isArray(v) ? v[0] : v) ?? window.navigator.language.replace("-", "_")
)

const origin = useQuery("origin", "*", (v) => (Array.isArray(v) ? v[0] : v))

const noSocket = useQuery("no_socket", false, assertBool)

const active = useQuery("active", true, assertBool)

const noPopup = useQuery("no_popup", false, assertBool)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function postMessage(res: any, origin: string) {
  const parent = window.parent || window.top

  if (parent === window) return

  if (origin === location.host) return

  parent.postMessage(res, origin)
}
function sendsetvalsuccess(id: string) {
  const res: Param_res__fb_set_value = {
    id,
    type: "res::fb:set_value",
    code: SET_VAL_CODES.SUCCESS_SET_PROP_SUCCESS,
    message: t(language.value, SET_VAL_CODES.SUCCESS_SET_PROP_SUCCESS),
  }
  postMessage(res, origin.value)
}
function sendSetValFailed(id: string) {
  const res: Param_res__fb_set_value = {
    id,
    type: "res::fb:set_value",
    code: SET_VAL_CODES.ERROR_INVALID_PROP,
    message: t(language.value, SET_VAL_CODES.ERROR_INVALID_PROP),
  }
  postMessage(res, origin.value)
}
function sendCodeState(codeq: CODES) {
  code.value = codeq
  const res: Param__emit__fb_embed = {
    type: "emit::fb_embed",
    code: codeq,
    message: t(language.value, codeq),
  }
  postMessage(res, origin.value)
}

const propsMap: {
  [key in keyof Props]: WritableComputedRef<Props[key]>
} = {
  color_scheme: colorScheme,
  href,
  lazy,
  mobile,
  num_posts: numPosts,
  order_by: orderBy,
  lang: language,
  origin,
  no_socket: noSocket,
  active,
  no_popup: noPopup,
}

useEventListener(
  window,
  "message",
  (event: MessageEvent<Param__req__fb_set_value | void>) => {
    if (event.data?.type !== "req::fb:set_value") return

    const { props, id } = event.data

    for (const [key, val] of Object.entries(props)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (key in propsMap) (propsMap as unknown as any)[key].value = val
      else sendSetValFailed(id)
    }

    sendsetvalsuccess(id)
  }
)

watch(
  href,
  (href) => {
    if (!href) sendCodeState(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)
  },
  { immediate: true }
)

function checkSdkLoaded(): boolean {
  return typeof window.FB !== "undefined"
}

async function relauchSDK_Plugin() {
  if (!href.value)
    return console.error("[href_not_exists]: href option is undefined or null")

  try {
    sendCodeState(LOADING_CODES.LOADING_LOADING_SDK)

    await loadFBSdk(language.value ?? "en_US", true)
    console.log("FB SDK loaded")

    if (!href.value)
      return sendCodeState(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)

    sendCodeState(LOADING_CODES.LOADING_LOADING_PLUGIN)
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    window.FB!.Event.unsubscribe("xfbml.render")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    window.FB!.Event.subscribe("xfbml.render", () => {
      sendCodeState(SUCCESS_CODES.SUCCESS_DONE)
    })

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    window.FB!.XFBML.parse()
  } catch (err) {
    console.error("load FB SDK failed")
    sendCodeState(ERROR_CODES.ERROR_LOAD_SDK_FAILED)
  }
}
watch(language, relauchSDK_Plugin)
watch(
  noSocket,
  (noSocket) => {
    if (noSocket) {
      ;[
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as unknown as any)._WebSocket,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as unknown as any).WebSocket,
      ] = [window.WebSocket, undefined]
    } else {
      if (!window.WebSocket)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.WebSocket = (window as unknown as any)._WebSocket
    }

    if (checkSdkLoaded()) relauchSDK_Plugin()
  },
  { immediate: true }
)
watch(
  active,
  (active) => {
    if (active) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (checkSdkLoaded()) window.FB!.XFBML.parse()
      else relauchSDK_Plugin()
    }
  },
  { immediate: true }
)

/**
 *  void observeDuck() {
    final wrapperEl = querySelector("#wrapper");

    if (wrapperEl == null) {
      throw Exception("#wrapper");
    }

    final observer = MutationObserver((mutationList, observer) {
      final nodeAdd = (mutationList[0].addedNodes[0] as Element);

      if (nodeAdd.classes.contains("fb-comments") ||
          nodeAdd.classes.contains("fb:comments")) {
        // check for comments
        reloadFBPlugin();
        print("re-mount plugin comment");
      }
    });

    observer.observe(wrapperEl, childList: true);
  }
 */

watch([colorScheme, href /*, lazy */, mobile, numPosts, orderBy], () => {
  if (!href.value)
    return sendCodeState(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)
  window.FB?.XFBML.parse()
})
</script>
