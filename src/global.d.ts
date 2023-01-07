let FB:
  | {
      XFBML: {
        parse: () => void
      }
      Event: {
        clear(): void
        unsubscribe(name?: string): void
        subscribe(name: string, cb: () => void)
      }
    }
  | undefined
