import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mermaid from "astro-mermaid";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import rehypeLinkPreviews from "./src/utils/rehypeLinkPreviews.mjs";
import rehypeSmartTypography from "./src/utils/smartTypography.mjs";

export default defineConfig({
  site: "https://mapsycoy.com",
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        themeVariables: { background: "transparent" },
      },
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", ko: "ko" },
      },
      filter: (page) => !page.includes("/admin"),
    }),
  ],
  markdown: unified({
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSmartTypography, rehypeLinkPreviews],
  }),
});
