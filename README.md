# embed-fbcmt (Embed Facebook Comment Plugin)

[![GitHub license](https://img.shields.io/github/license/anime-vsub/embed-fbcmt)](https://github.com/anime-vsub/embed-fbcmt/blob/main/LICENSE) <img alt="GitHub Issues" src="https://img.shields.io/github/issues/anime-vsub/embed-fbcmt" /> <img alt="Code Score" src="https://api.codiga.io/project/35013/score/svg" /> <img alt="Code Score" src="https://api.codiga.io/project/35013/status/svg" />

[![Test](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/test.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/test.yml)
[![CodeQL](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/codeql.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/codeql.yml) [![ESLint](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/eslint.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/eslint.yml) [![Prettier](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/prettier.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/prettier.yml)
[![TypeScript Checker Declaration](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/typing.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/typing.yml)
[![Try build](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/try-build.yml/badge.svg)](https://github.com/anime-vsub/embed-fbcmt/actions/workflows/try-build.yml)

This is a plugin allow embed [Facebook Comment Plugin](https://developers.facebook.com/docs/plugins/comments/) to website SPA

## Usage
Append this code to location show comment:
```html
<iframe src="https://anime-vsub.github.io/embed-fbcmt?<options>"></iframe>
```
> All mentioned [`options of FB comment plugin`](https://developers.facebook.com/docs/plugins/comments/) are available.
In addition, you can also use some of the following custom options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `lang` | code lang | `en_US` | language the plugin will display (example: `vi_VN`, `ja_JP`...) |
| `loader_bg` | color | `rgba(0,0,0,0.8)` | adjust background color when plugin is loading |
| `loader_text` | color | `white` | adjust text color when plugin is loading |
| `origin` | host name | `*` | domain name will be sent the message. you can specify the hostname of the embedded website to increase security |
| `no_socket` | boolean | `false` | whether to disable `WebSocket` to save resources |
| `no_popup` | boolean | `false` | remove loading popup and use error warnings when you customize them |

## Package NPM
This package allows you to send change requests to the plugin without losing the SDK reload time. A useful thing for SPA website
### Install
```bash
pnpm add embed-fbcmt-client
```

You can use this plugin anywhere I will give an example with `Vue`
```vue
<template>
   <button @click="setPropValue(cmtRef, 'lang', 'ja_JP')">Change lang to Japanese</button>

   <iframe ref="cmtRef" src="https://anime-vsub.github.io/embed-fbcmt?https://google.com&lang=en_US" />

</template>

<script lang="ts" setup>
import { ref } from "vue"
import { setPropValue } from "embed-fbcmt-client/vue"

const cmtRef = ref<HTMLIFrameElement>()
</script>
```
### Functions
```ts
function setPropValue(el: HTMLIFrameElement | Ref<HTMLIFrameElement>, propName: string, value: string): Promise<void>
```
- Options:
   - `el`: iframe embed plugin
   - `propName`: option name set
   - `value`: value set to prop
- Return: `Promise<void>` a promise that resolves when the set option succeeds or fails

```ts
function listenEvent(
  el: HTMLIFrameElement,
  cb: (event: { type: "success" | "loading" | "error"; code: CODES }) => void
): () => void
```
- Options:
   - `el`: iframe embed plugin
   - `cb`: this function is cakked every time something changes in the embed
- Return: `() => void` cancel


### For vue
```ts
function useEmbed(el: HTMLIFrameElement | Ref<HTMLIFrameElement>): {
   code: CODES // code status embed
   loading: boolean // true is loading
   error: boolean // true is error emited
}
```
