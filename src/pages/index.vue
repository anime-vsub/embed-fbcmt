<template>
  <div
    class="fb-comments"
    :data-colorscheme="colorScheme"
    :data-href="href"
    :data-lazy="lazy"
    :data-mobile="mobile"
    :data-numposts="numPosts"
    :data-order-by="orderBy"
    data-width="100%"
  />
  
  
  <Loader v-if="typeCode === 'loading'" :code="code" />
  <Error v-if="typeCode === 'error'" :code="code" />
</template>

<script lang="ts" setup>
import { useQuery } from "src/composibles/useQuery"
import { watch, ref, computed } from "vue"
import { loadFBSdk } from "src/logic/load-fb-sdk"
import { useNavigatorLanguage, useEventListener } from "@vueuse/core"
import {
  Param_res__fb_set_value,
  Param__req__fb_set_value,
  CODES,
  ERROR_CODES,
  LOADING_CODES,
  SUCCESS_CODES,
} from "src/constants"
import Loader from "src/components/Loader.vue"
import Error from "src/components/Error.vue"

const code = ref<CODES | null>(null)
const typeCode = computed<"success" | "loading" | "error" | null>(() => {
  if (!code.value) return null

  return (code.value as string).slice(0, (code.value as string).indexOf(".")) as "success" | "loading" | "error"
})

const colorScheme = useQuery<"dark" | "light">("color_scheme", "light", (v) =>
  v === "dark" || v === "light" ? v : undefined
)
const href = useQuery("href", "", (v) => (Array.isArray(v) ? v[0] : v)) // ref<string>()
const lazy = useQuery("lazy", false, (v) => {
  if (Array.isArray(v)) v = v[0]

  switch (v) {
    case "true":
      return true
    case "false":
      return false
  }
}) // ref(false)
const mobile = useQuery<boolean | void>("mobile", undefined, (v) => {
  if (Array.isArray(v)) v = v[0]

  switch (v) {
    case "true":
      return true
    case "false":
      return false
  }
}) // ref<void | boolean>()
const numPosts = useQuery("num_posts", 10, (v) => {
  if (Array.isArray(v)) v = v[0]

  const n = parseInt(v + "")

  if (Number.isNaN(n)) return

  return n
}) //ref(10)
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

function sendSetValSuccess(prop: string) {
  const res: Param_res__fb_set_value = {
    type: "res::fb:set_value",
    // prop,
    code: SET_VAL_CODES.SUCCESS_SET_PROP_SUCCESS,
    data : prop,
  }
  ;(window.parent || window.top)?.postMessage(res, "*")
}
function sendSetValFailed(prop: string) {
  const res: Param_res__fb_set_value = {
    type: "res::fb:set_value",
    // prop,
    code: ERROR_CODES.ERROR_INVALID_PROP,
    data : prop,
  }
  ;(window.parent || window.top)?.postMessage(res, "*")
}
function sendCodeState(
  codeq: LOADING_CODES[keyof LOADING_CODES],
  data?: unknown
) {
  
  code.value=codeq
  const res: Param__emit__fb_embed= {
    type: "emit::fb_embed",
    // prop,
    code: codeq,
    data,
  }
  ;(window.parent || window.top)?.postMessage(res, "*")
}
useEventListener(
  window,
  "message",
  (
    event: MessageEvent<{
      type?: unknown
      prop?: unknown
      val?: unknown
    } | void>
  ) => {
    if (event.data?.type !== "req::fb:set_value") return

    const { prop } = event.data
    const val = event.data.val as any
    switch (prop) {
      case "color_scheme":
        colorScheme.value = val
        sendSetValSuccess(prop)
        break
      case "href":
        href.value = val
        sendSetValSuccess(prop)
        break
      case "lazy":
        lazy.value = val
        sendSetValSuccess(prop)
        break
      case "mobile":
        href.value = val
        sendSetValSuccess(prop)
        break
      case "num_posts":
        numPosts.value = val
        sendSetValSuccess(prop)
        break
      case "order_by":
        orderBy.value = val
        sendSetValSuccess(prop)
        break
      case "lang":
        language.value = val
        sendSetValSuccess(prop)
        break
      default:
        sendSetValFailed(prop + "")
    }
  }
)

watch(
  href,
  (href) => {
    if (!href) sendCodeState(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)
  },
  { immediate: true }
)

watch(
  language,
  async (language = "en_US") => {
    if (!href.value) return

    try {
      sendCodeState(LOADING_CODES.LOADING_LOADING_SDK)

      await loadFBSdk(language, true)
      console.log("FB SDK loaded")

      if (!href.value)
        return sendSetValFailed(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)

      sendCodeState(LOADING_CODES.LOADING_LOADING_PLUGIN)
      window.FB.Event.unsubscribe("xfbml.render")
      window.FB.Event.subscribe("xfbml.render", () =>{  
        sendCodeState(SUCCESS_CODES.SUCCESS_DONE)
      })

      window.FB.XFBML.parse()
    } catch (err) {
      console.error("load FB SDK failed")
      sendCodeState(ERROR_CODES.ERROR_LOAD_SDK_FAILED)
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

watch([colorScheme, href /*, lazy*/, mobile, numPosts, orderBy], () => {
  if (!href.value) return sendSetValFailed(ERROR_CODES.ERROR_PARAMS_HREF_NOT_EXISTS)
      window.FB?.XFBML.parse()
})
</script>
