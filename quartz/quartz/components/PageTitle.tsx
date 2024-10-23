import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <>
      <a href="/">
        <img style={{ margin: 0 }} src="static/pubky-core-logo.svg" width={209} height={44} />
      </a>
      {/** <h2 class={classNames(displayClass, "page-title")}>
        <a href={baseDir}>
          {title === "Pubky Knowledge Base" && (
            <>
              Pubky
              <br />
              Knowledge Base
            </>
          )}
        </a>
      </h2> */}
    </>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
