import { C as CODES } from './main-2f93ff59.js';
export { s as setPropValue } from './main-2f93ff59.js';
import { Ref } from 'vue';

declare function useEmbed(el: HTMLIFrameElement | Ref<HTMLIFrameElement>): {
    code: Ref<CODES | null>;
    loading: Ref<boolean>;
    error: Ref<boolean>;
};

export { useEmbed };
