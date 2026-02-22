import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
  let title = fileData.frontmatter?.title

  // Check if the title is defaulting to "index" or is an auto-generated folder title
  const isDefaultTitle = title === "index" || title?.startsWith("Folder: ")

  if (isDefaultTitle) {
    if (fileData.slug === "index") {
      // Home Page -> Use the site name from quartz.config.ts
      title = cfg.pageTitle
    } else if (fileData.slug?.endsWith("/index")) {
      // Folder page
      const pathSegments = fileData.slug.split("/")
      const folderSlug = pathSegments[pathSegments.length - 2]
      title = folderSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    }
  }

  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
