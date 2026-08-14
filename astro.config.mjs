import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mermaid from "astro-mermaid";
import { unified } from "@astrojs/markdown-remark";
import remarkGfm from "remark-gfm";
import rehypeLinkPreviews from "./src/utils/rehypeLinkPreviews.mjs";
import rehypeSmartTypography from "./src/utils/smartTypography.mjs";
import rehypeNoteSections from "./src/utils/rehypeNoteSections.mjs";

export default defineConfig({
  site: "https://mapsycoy.com",
  integrations: [
    mermaid({
      autoTheme: false,
      enableLog: false,
      mermaidConfig: {
        theme: "base",
        themeVariables: {
          primaryColor: "#808080",
          mainBkg: "transparent",
          primaryBorderColor: "#808080",
          primaryTextColor: "#808080",
          lineColor: "#808080",
          textColor: "#808080",
          clusterBkg: "#808080",
          clusterBorder: "#808080",
          titleColor: "#808080",
          edgeLabelBackground: "#808080",
          rowOdd: "#808080",
          rowEven: "#808080",
          surface0: "#808080",
          surfacePeer0: "#808080",
          surface1: "#808080",
          surfacePeer1: "#808080",
          surface2: "#808080",
          surfacePeer2: "#808080",
          surface3: "#808080",
          surfacePeer3: "#808080",
          surface4: "#808080",
          surfacePeer4: "#808080",
        },
        flowchart: { htmlLabels: true },
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
  markdown: {
    processor: unified({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSmartTypography, rehypeLinkPreviews, rehypeNoteSections],
    }),
  },
});
