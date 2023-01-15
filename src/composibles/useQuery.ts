import { computed, nextTick, ref, watch } from "vue"
import type { LocationQueryValue } from "vue-router"
import { useRoute, useRouter } from "vue-router"

import { isInIframe } from "../logic/is-in-iframe"

const inIframe = isInIframe()

export function useQuery<T>(
  name: string,
  defaultValue: T,
  assert: (
    value: string | LocationQueryValue[] | NonNullable<T> | null
  ) => T | undefined | null
) {
  const route = useRoute()
  const router = useRouter()

  const query = ref<T>()
  watch(
    () => route.query[name],
    (data) => (query.value = (assert(data) ?? defaultValue) as unknown as T),
    { immediate: true }
  )

  return computed<T>({
    get() {
      return query.value as unknown as T
    },
    set(v) {
      if (!inIframe)
        nextTick(() => {
          router.replace({
            ...route,
            query: {
              ...route.query,
              [name]: v === defaultValue || v === null ? undefined : v,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as unknown as any,
          })
        })
      else query.value = v
    },
  })
}
