'use strict';

var vue = require('vue');

// src/client/vue.ts

// src/client/main.ts
function setPropValue(el, prop, value, origin = "*") {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      if (event.data?.type === "res::fb:set_value") {
        const { code, data } = event.data;
        if (typeof code !== "string")
          return;
        if (code.startsWith("success."))
          resolve();
        else if (code.startsWith("error."))
          reject(Object.assign(new Error(code), { prop: data }));
        else
          console.warn("[res::fb:set_value]: invalid code error '%s'", code);
        window.removeEventListener("message", handler);
      }
    };
    window.addEventListener("message", handler);
    const res = {
      type: "req::fb:set_value",
      prop,
      val: value
    };
    if (el.contentWindow)
      el.contentWindow.postMessage(res, origin);
    else
      reject();
  });
}
function listenEvent(el, cb) {
  const handler = (event) => {
    if (event.source !== el.contentWindow)
      return;
    if (event.data?.type !== "emit::fb_embed")
      return;
    const typeCode = getTypeCode(event.data.code);
    if (!typeCode)
      return;
    cb({
      type: typeCode,
      code: event.data.code
    });
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}
function getTypeCode(code) {
  if (code.startsWith("success."))
    return "success";
  if (code.startsWith("loading."))
    return "loading";
  if (code.startsWith("error."))
    return "error";
  return null;
}

// src/client/vue.ts
function useEmbed(el) {
  const code = vue.ref(null);
  const loading = vue.ref(false);
  const error = vue.ref(false);
  let cancel = null;
  if (!vue.isRef(el))
    el = vue.ref(el);
  vue.watch(
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
  vue.onBeforeUnmount(() => cancel?.());
  return { code, loading, error };
}

exports.setPropValue = setPropValue;
exports.useEmbed = useEmbed;
