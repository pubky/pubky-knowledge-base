import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      Synonym: "https://synonym.to",
      GitHub: "https://github.com/pubky/pubky-knowledge-base",
      Telegram: "https://t.me/pubkychat",
    },
  }),
}

const explorer = Component.Explorer({
  sortFn: (a, b) => {
    // Helper function to prioritise "Introduction" and "ELI5"
    const priority = (name: string) => {
      if (name === "Introduction") return -2 // Highest priority
      if (name === "ELI5") return -1 // Second highest priority
      return 0 // No priority
    }

    // Check if both are files or directories
    const aIsFile = typeof a.file !== null
    const bIsFile = typeof b.file !== null

    // Prioritize specific filenames first
    const aPriority = priority(a.name)
    const bPriority = priority(b.name)

    // If either has a priority, sort based on that
    if (aPriority !== bPriority) return aPriority - bPriority

    // If one is a file and the other is a directory, sort files first
    if (aIsFile && !bIsFile) return -1 // a is a file, b is a directory
    if (!aIsFile && bIsFile) return 1 // a is a directory, b is a file

    // If both are either files or directories, sort alphabetically
    return a.name.localeCompare(b.name)
  },
})

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorer),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    //Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorer),
  ],
  right: [],
}
