import type { PropType } from "vue"
import { defineComponent, h, ref, watch } from "vue"

import type { Props } from "../constants"
import { defaults } from "../constants"

import { setPropValue, useEmbedHeight } from "./vue"

export default defineComponent({
  props: {
    color_scheme: {
      type: String as PropType<Props["color_scheme"]>,
      default: defaults.color_scheme,
    },
    href: {
      type: String as PropType<Props["href"]>,
      required: true,
    },
    lazy: {
      type: Boolean as PropType<Props["lazy"]>,
      default: defaults.lazy,
    },
    mobile: {
      type: Boolean as PropType<Props["lazy"]>,
      default: defaults.mobile,
    },
    num_posts: {
      type: Number as PropType<Props["num_posts"]>,
      default: defaults.num_posts,
    },
    order_by: {
      type: String as PropType<Props["order_by"]>,
      default: defaults.order_by,
    },
    lang: {
      type: String as PropType<Props["lang"]>,
      default: defaults.lang,
    },
    origin: {
      type: String as PropType<Props["origin"]>,
      default: defaults.origin,
    },
    no_socket: {
      type: Boolean as PropType<Props["no_socket"]>,
      default: defaults.no_socket,
    },
    active: {
      type: Boolean as PropType<Props["active"]>,
      default: defaults.active,
    },
    no_popup: {
      type: Boolean as PropType<Props["no_popup"]>,
      default: defaults.no_popup,
    },
    service: {
      type: String as PropType<string>,
      default: "https://anime-vsub.github.io/embed-fbcmt",
    },
  },
  setup(props) {
    const rootSrc = ref<string>()
    watch(
      () => props.service,
      (service) => {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const query = new URLSearchParams(
          props as unknown as Record<string, string>
        )
        query.delete("service")

        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        rootSrc.value = new URL(`?${query}`, service).toString()
      },
      { immediate: true }
    )

    const commentRef = ref<HTMLIFrameElement>()
    watch(props, async (props) => {
      const cloned = { ...props }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (cloned as unknown as any).service
      await setPropValue(commentRef, cloned)
    })
    const height = useEmbedHeight(commentRef)

    return () =>
      h("iframe", {
        src: rootSrc.value,
        ref: commentRef,
        frameborder: "0",
        allowtransparency: "true",
        allowfullscreen: "true",
        scrolling: "no",
        allow: "encrypted-media",
        width: "100%",
        height: "100%",
        style: { height: `${height}px` },
      })
  },
})
