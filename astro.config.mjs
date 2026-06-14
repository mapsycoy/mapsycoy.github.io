import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeLinkPreviews from "./src/utils/rehypeLinkPreviews.mjs";

export default defineConfig({
  site: "https://mapsycoy.github.io",
  markdown: unified({
    rehypePlugins: [rehypeLinkPreviews],
  }),
});
