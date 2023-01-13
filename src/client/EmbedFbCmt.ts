import type { PropType } from "vue";
import { defineComponent, h , ref, watch } from "vue"

import { setPropValue } from "./vue"

interface Props {
  color_scheme?: "light" | "dark"
  href: string
  lazy?: boolean
  mobile?: boolean
  num_posts?: number
  order_by?: "time" | "reverse_time"
  lang?: string
  origin?: string
  no_socket?: boolean
  active?: boolean
  no_popup?: boolean
  service?: string
}

export default defineComponent({
  props: {
    color_scheme: String as PropType<Props["color_scheme"]>,
    href: {
      type: String as PropType<Props["href"]>,
      required: true,
    },
    lazy: Boolean as PropType<Props["lazy"]>,
    mobile: Boolean as PropType<Props["lazy"]>,
    num_posts: Number as PropType<Props["num_posts"]>,
    order_by: String as PropType<Props["order_by"]>,
    lang: String as PropType<Props["lang"]>,
    origin: String as PropType<Props["origin"]>,
    no_socket: Boolean as PropType<Props["no_socket"]>,
    active: Boolean as PropType<Props["active"]>,
    no_popup: Boolean as PropType<Props["no_popup"]>,
    service: {
      type: String as PropType<Props["service"]>,
      default: "https://anime-vsub.github.io/embed-fbcmt",
    },
  },
  setup(props: Props) {
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
    watch(props, async (props) => await setPropValue(commentRef, props))

    return () =>
      h("iframe", {
        src: rootSrc.value,
        ref_key: "commentRef",
        frameborder: "0",
        allowtransparency: "true",
        allowfullscreen: "true",
        scrolling: "no",
        allow: "encrypted-media",
        width: "100%",
        height: "100%",
      })
  },
})
