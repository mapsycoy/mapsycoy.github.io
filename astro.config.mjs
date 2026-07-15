import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import rehypeLinkPreviews from "./src/utils/rehypeLinkPreviews.mjs";
import rehypeSmartTypography from "./src/utils/smartTypography.mjs";

export default defineConfig({
  site: "https://mapsycoy.github.io",
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
    }),
  ],
  markdown: unified({
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSmartTypography, rehypeLinkPreviews],
  }),
});
