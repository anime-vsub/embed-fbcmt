let sdkLoaded = false

export function loadFBSdk(lang: string, force?: boolean) {
  if (force) {
    sdkLoaded = false
    window.FB?.Event.clear()
    window.FB = undefined
  }

  if (sdkLoaded) return

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://connect.facebook.net/${lang}/sdk.js#xfbml=1&version=v15.0&autoLogAppEvents=1`
    script.nonce = "XStSrfhG"

    script.onload = () => {
      sdkLoaded = true
      script.onload = script.onerror = null
      resolve()
    }
    script.onerror = () => {
      script.onload = script.onerror = null
      reject()
    }
    ;(document.head || document.documentElement).appendChild(script)
    // script.remove()
  })
}

window.loadSdk = loadFBSdk