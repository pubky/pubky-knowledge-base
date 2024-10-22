import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/search.scss"
// @ts-ignore
import script from "./scripts/search.inline"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

export interface SearchOptions {
  enablePreview: boolean
}

const defaultOptions: SearchOptions = {
  enablePreview: true,
}

export default ((userOpts?: Partial<SearchOptions>) => {
  const Search: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const searchPlaceholder = i18n(cfg.locale).components.search.searchBarPlaceholder
    return (
      <div class={classNames(displayClass, "search")}>
        <div id="search-icon">
          <p>{i18n(cfg.locale).components.search.title}</p>
          <div></div>
          <svg
            tabIndex={0}
            aria-labelledby="title desc"
            role="img"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title id="title">Search</title>
            <desc id="desc">Search</desc>
            <path
              opacity="0.2"
              d="M9.06213 15.625C12.6865 15.625 15.6246 12.6869 15.6246 9.0625C15.6246 5.43813 12.6865 2.5 9.06213 2.5C5.43777 2.5 2.49963 5.43813 2.49963 9.0625C2.49963 12.6869 5.43777 15.625 9.06213 15.625Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.06213 3.125C5.78294 3.125 3.12463 5.78331 3.12463 9.0625C3.12463 12.3417 5.78294 15 9.06213 15C12.3413 15 14.9996 12.3417 14.9996 9.0625C14.9996 5.78331 12.3413 3.125 9.06213 3.125ZM1.87463 9.0625C1.87463 5.09295 5.09259 1.875 9.06213 1.875C13.0317 1.875 16.2496 5.09295 16.2496 9.0625C16.2496 13.032 13.0317 16.25 9.06213 16.25C5.09259 16.25 1.87463 13.032 1.87463 9.0625Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2603 13.2612C13.5044 13.0171 13.9001 13.0171 14.1442 13.2612L17.9411 17.0581C18.1852 17.3022 18.1852 17.6979 17.9411 17.942C17.6971 18.1861 17.3013 18.1861 17.0572 17.942L13.2603 14.1451C13.0163 13.901 13.0163 13.5053 13.2603 13.2612Z"
              fill="white"
            />
          </svg>
        </div>
        <div id="search-container">
          <div id="search-space">
            <input
              autocomplete="off"
              id="search-bar"
              name="search"
              type="text"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
            />
            <div id="search-layout" data-preview={opts.enablePreview}></div>
          </div>
        </div>
      </div>
    )
  }

  Search.afterDOMLoaded = script
  Search.css = style

  return Search
}) satisfies QuartzComponentConstructor
