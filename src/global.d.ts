var FB: {
  XFBML: {
    parse: () => void
  }
  Event: {
    subscribe(name: string, cb: () => void)
  }
} | undefined
