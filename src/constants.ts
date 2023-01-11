export enum SUCCESS_CODES {
  SUCCESS_DONE = "success.done",
}
export enum ERROR_CODES {
  ERROR_LOAD_SDK_FAILED = "error.load_sdk_failed",
  ERROR_PARAMS_HREF_NOT_EXISTS = "error.params_href_not_exists",
}
export enum LOADING_CODES {
  LOADING_LOADING_SDK = "loading.loading_sdk",
  LOADING_LOADING_PLUGIN = "loading.loading_plugin",
}
export enum SET_VAL_CODES {
  SUCCESS_SET_PROP_SUCCESS = "success.set_prop_success",
  ERROR_INVALID_PROP = "error.invalid_prop",
}

export type CODES = SUCCESS_CODES | ERROR_CODES | LOADING_CODES
export interface Param__emit__fb_embed {
  type: "emit::fb_embed"
  code: CODES
  message: string
  data?: unknown
}

export interface Props {
  color_scheme: "light" | "dark"
  href: string
  lazy: boolean | undefined
  mobile: boolean | undefined
  num_posts: number
  order_by: "time" | "reverse_time"
  lang: string
}
export interface Param__req__fb_set_value<T extends keyof Props> {
  type: "req::fb:set_value"
  prop: T
  val: Props[T]
}
export interface Param_res__fb_set_value {
  type: "res::fb:set_value"
  code: SET_VAL_CODES
  message: string
  data: string // is prop set success
}
