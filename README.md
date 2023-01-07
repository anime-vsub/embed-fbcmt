# embed-fbcmt (Embed Facebook Comment Plugin)
This is a plugin allow embed [Facebook Comment Plugin](https://developers.facebook.com/docs/plugins/comments/) to website SPA

## Usage
Append this code to location show comment:
```html
<iframe src="https://anime-vsub.github.io/embed-fbcmt?<options>"></iframe>
```
> All mentioned [`options of FB comment plugin`](https://developers.facebook.com/docs/plugins/comments/) are available.
In addition, you can also use some of the following custom options:

| Option | Type | Description |
| ------ | ---- | ----------- |
| `lang` | code lang | language the plugin will display (example: `vi_VN`, `ja_JP`...) |
| `loader_bg` | color | adjust background color when plugin is loading |
| `loader_text` | color | adjust text color when plugin is loading |

## Package NPM
This package allows you to send change requests to the plugin without losing the SDK reload time. A useful thing for SPA website
### Install
```bash
pnpm add embed-fbcmt-client
```

You can use this plugin anywhere I will give an example with `Vue`
```vue
<template>
   <button @click="setPropValue(cmtRef, 'lang', 'ja_JP')>Change lang to Japanese</button>

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