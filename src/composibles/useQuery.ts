import { computed, nextTick, unref, ComputedRef } from "vue"
import { LocationQueryValue, useRoute, useRouter } from "vue-router"

export function useQuery<T>(
  name: string,
  defaultValue: T,
  assert: (value: string | LocationQueryValue[] | NonNullable<T> | null) => T | undefined | null
) {
  const route = useRoute()
  const router = useRouter()

  return computed<T>({
    get() {
      const data = route.query[name]

      return assert(data) ?? defaultValue
    },
    set(v) {
      nextTick(() => {
        router.replace({
          ...route,
          query: {
            ...route.query,
            [name]: v === defaultValue || v === null ? undefined : v,
          } as unknown as any,
        })
      })
    },
  })
}
