import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <>
        <footer class={`${displayClass ?? ""}`}>
          <div
            style={{
              border: "none",
              borderTop: "0.1px solid white",
              width: "100%",
              marginTop: "100px",
              marginBottom: "35px",
              opacity: 0.7,
            }}
          />
          <ul>
            {Object.entries(links).map(([text, link]) => (
              <li>
                <a style={{ color: "white", fontWeight: 400, fontSize: "17px" }} href={link}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </footer>
        <div
          style={{
            backgroundImage: "url('/static/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            pointerEvents: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
        <div
          style={{
            backgroundImage: "url('/static/bg-2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            pointerEvents: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
        <div
          style={{
            backgroundImage: "url('/static/bg-3.png')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            position: "fixed",
            pointerEvents: "none",
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            maxHeight: "20%",
            maxWidth: "20%",
            zIndex: 0,
          }}
        />
      </>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
