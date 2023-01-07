import { defineConfig } from "windicss/helpers"
import forms from "windicss/plugin/forms"
import lineClamp from "windicss/plugin/line-clamp"
import scrollSnap from "windicss/plugin/scroll-snap"

export default defineConfig({
  plugins: [lineClamp, scrollSnap, forms],
  safelist: [],
  theme: {
    screens: {
      // xs: { min: "0px", max: "599.99px" },
      sm: "600px", // { min: "600px", max: "1023.99px" },
      md: "1024px", // { min: "1024px", max: "1439.99px" },
      lg: "1440px", // { min: "1440px", max: "1919.99px" },
      xl: "1920px", // { min: "1920px" },
    },
  },
})
