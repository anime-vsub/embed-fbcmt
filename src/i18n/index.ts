import type {
  CODES,
  ERROR_CODES,
  LOADING_CODES,
  SET_VAL_CODES,
  SUCCESS_CODES,
} from "src/constants"

export function defineLocale(
  messages: Record<
    SUCCESS_CODES | ERROR_CODES | LOADING_CODES | SET_VAL_CODES,
    string
  >
) {
  return messages
}

const reg = /[\w-]+(?=\.ts$)/
// eslint-disable-next-line n/no-unsupported-features/es-builtins
const langs = Object.fromEntries(
  Object.entries(import.meta.glob("./messages/*.ts", { eager: true })).map(
    ([path, messages]) => [reg.exec(path)?.[0], messages]
  )
)

export function t(locale: typeof langs[0], key: CODES | SET_VAL_CODES): string {
  return (langs[locale] ?? langs.en_US).default[key] ?? key
}
