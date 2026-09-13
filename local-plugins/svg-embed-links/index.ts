import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types"
import type { FullSlug, TransformOptions } from "@quartz-community/utils"
import { transformLink } from "@quartz-community/utils"
import { visit } from "unist-util-visit"
import type { Root, Element } from "hast"
import type { VFile } from "vfile"

export interface SvgEmbedLinksOptions {
  /** How to resolve the resulting img[src] path. Mirrors crawl-links' markdownLinkResolution. */
  markdownLinkResolution: TransformOptions["strategy"]
}

const defaultOptions: SvgEmbedLinksOptions = {
  markdownLinkResolution: "shortest",
}

function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")
}

// Obsidian's ![[foo.svg]] embed syntax is rendered by obsidian-flavored-markdown
// as <object data="foo.svg" type="image/svg+xml">, not <img src="foo.svg">.
// That causes two separate problems, both fixed here by converting it to a
// plain <img> instead of trying to patch around it:
//
// 1. Path resolution: crawl-links' link-crawling pass only rewrites
//    img/video/audio/iframe src attributes (see its transformer source), so
//    object[data] is never touched -- the raw, unresolved filename is left
//    in the output and 404s unless the referencing page happens to sit at
//    exactly the same directory depth as the asset.
//
// 2. Scaling: <object> renders an SVG as a nested document. If that SVG has
//    no viewBox, giving the <object> an explicit width/height just clips the
//    canvas instead of scaling the drawing, because <object>'s "SVG
//    document" rendering context doesn't get a viewBox synthesized for it.
//    <img> (and CSS background-image) render SVGs in an "image" context,
//    where browsers DO synthesize a viewBox from the SVG's own width/height
//    when none is given, so it scales correctly instead of clipping -- this
//    is also almost certainly how Obsidian itself renders ![[foo.svg]],
//    which is why the exact same source SVG doesn't have this problem there.
//
// Converting to <img> fixes both at once, without needing to touch the SVG
// source files themselves (e.g. adding a synthetic viewBox to each one).
export const SvgEmbedLinks: QuartzTransformerPlugin<Partial<SvgEmbedLinksOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "SvgEmbedLinks",
    htmlPlugins(ctx: BuildCtx) {
      return [
        () => {
          return (tree: Root, file: VFile) => {
            const fileSlug = file.data.slug as FullSlug
            const transformOptions: TransformOptions = {
              strategy: opts.markdownLinkResolution,
              allSlugs: ctx.allSlugs,
            }

            visit(tree, "element", (node: Element) => {
              if (node.tagName !== "object") return
              if (node.properties?.type !== "image/svg+xml") return
              const dest = node.properties.data
              if (typeof dest !== "string") return

              const resolved =
                isAbsoluteUrl(dest) || dest.startsWith("#")
                  ? dest
                  : transformLink(fileSlug, dest, transformOptions)

              const alt = node.properties.ariaLabel ?? node.properties["aria-label"] ?? ""
              const width = node.properties.width
              const height = node.properties.height

              node.tagName = "img"
              node.properties = { src: resolved, width, height, alt }
              node.children = []
            })
          }
        },
      ]
    },
  }
}
