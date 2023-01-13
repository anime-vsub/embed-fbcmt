declare namespace globalThis {
  // eslint-disable-next-line no-var
  var FB:
    | {
        XFBML: {
          parse: () => void
        }
        Event: {
          // eslint-disable-next-line functional/no-method-signature
          clear(): void
          // eslint-disable-next-line functional/no-method-signature
          unsubscribe(name?: string): void
          // eslint-disable-next-line functional/no-method-signature
          subscribe(name: string, cb: () => void)
        }
      }
    | undefined
}
