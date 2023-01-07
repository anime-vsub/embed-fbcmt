import { listenEvent } from './chunk-QHBEK6QZ.js';
export { setPropValue } from './chunk-QHBEK6QZ.js';
import { ref, isRef, watch, onBeforeUnmount } from 'vue';

function useEmbed(el) {
  const code = ref(null);
  const loading = ref(false);
  const error = ref(false);
  let cancel = null;
  if (!isRef(el))
    el = ref(el);
  watch(
    el,
    (el2) => {
      cancel?.();
      loading.value = error.value = false;
      if (!el2)
        return;
      cancel = listenEvent(el2, (event) => {
        code.value = event.code;
        if (event.type === "loading") {
          error.value = false;
          loading.value = true;
        } else if (event.type === "error") {
          loading.value = false;
          error.value = true;
        } else {
          error.value = loading.value = false;
        }
      });
    },
    { immediate: true }
  );
  onBeforeUnmount(() => cancel?.());
  return { code, loading, error };
}

export { useEmbed };
