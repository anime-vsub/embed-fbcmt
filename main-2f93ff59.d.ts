declare enum SUCCESS_CODES {
    SUCCESS_DONE = "success.done"
}
declare enum ERROR_CODES {
    ERROR_LOAD_SDK_FAILED = "error.load_sdk_failed",
    ERROR_PARAMS_HREF_NOT_EXISTS = "error.params_href_not_exists"
}
declare enum LOADING_CODES {
    LOADING_LOADING_SDK = "loading.loading_sdk",
    LOADING_LOADING_PLUGIN = "loading.loading_plugin"
}
type CODES = SUCCESS_CODES[keyof SUCCESS_CODES] | ERROR_CODES[keyof ERROR_CODES] | LOADING_CODES[keyof LOADING_CODES];
interface Props {
    color_scheme: "light" | "dark";
    href: string;
    lazy: boolean | undefined;
    mobile: boolean | undefined;
    num_posts: number;
    order_by: "time" | "reverse_time";
    lang: string;
}

declare function setPropValue<T extends keyof Props>(el: HTMLIFrameElement, prop: T, value: Props[T], origin?: string): Promise<void>;
declare function listenEvent(el: HTMLIFrameElement, cb: (event: {
    type: "success" | "loading" | "error";
    code: CODES;
}) => void): () => void;
declare function getTypeCode(code: any): "success" | "loading" | "error" | null;

export { CODES as C, getTypeCode as g, listenEvent as l, setPropValue as s };
