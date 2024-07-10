import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Pubky Knowledge Base",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "pubky.synonym.to",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Poppins",
        body: "Lora",
        code: "Fira Code",
      },
      colors: {
        lightMode: {
          light: "#ffffff", // White
          lightgray: "#f2f2f2", // Very light gray
          gray: "#cccccc", // Light gray
          darkgray: "#4a4a4a", // Dark gray
          dark: "#333333", // Almost black
          secondary: "#3498db", // Bright blue
          tertiary: "#e74c3c", // Bright red
          highlight: "rgba(52, 152, 219, 0.15)", // Light blue highlight
          textHighlight: "#f1c40f88", // Yellow text highlight
        },
        darkMode: {
          light: "#1e1e1e", // Very dark gray
          lightgray: "#2c2c2c", // Darker gray
          gray: "#575757", // Medium gray
          darkgray: "#d4d4d4", // Light gray
          dark: "#ecf0f1", // Very light gray
          secondary: "#2980b9", // Darker blue
          tertiary: "#c0392b", // Darker red
          highlight: "rgba(41, 128, 185, 0.15)", // Dark blue highlight
          textHighlight: "#f39c1288", // Orange text highlight
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
