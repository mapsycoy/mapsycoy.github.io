import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import rehypeLinkPreviews from "./src/utils/rehypeLinkPreviews.mjs";
import rehypeSmartTypography from "./src/utils/smartTypography.mjs";

export default defineConfig({
  site: "https://mapsycoy.github.io",
  markdown: unified({
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSmartTypography, rehypeLinkPreviews],
  }),
});
