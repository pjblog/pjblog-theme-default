import { PropsWithChildren, createContext, useContext } from "react";
import { IHtmlProps, IHtmlMetaData } from "./types";
import { useMemo } from "react";
const HTMLMetaDataContext = createContext<Pick<IHtmlMetaData, 'title' | 'description'> & {
  url: string
}>(
  typeof window !== 'undefined'
    ? window.PJBLOG_HTML_METADATA
    : {
      title: null,
      description: null,
      url: null,
    }
)

// vite 专属内容
const HMRContent = `import RefreshRuntime from '/@react-refresh';RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;window.__vite_plugin_react_preamble_installed__ = true;`;

export default (props: PropsWithChildren<IHtmlProps>) => {
  const html_props = useMemo(() => {
    return {
      title: props.title,
      description: props.description,
      url: props.url,
    }
  }, [props.title, props.description, props.url])
  return <html lang="en">
    <head>
      <title>{props.title}</title>
      {!!props.dev && <script dangerouslySetInnerHTML={{ __html: HMRContent }} type="module"></script>}
      {!!props.dev && <script type="module" src="/@vite/client"></script>}
      <meta charSet="UTF-8" />
      <meta name="keywords" content={props.keywords.join(',')} />
      <meta name="description" content={props.description} />
      <meta name="domain" content={props.domain} />
      {/* <link rel="icon" type="image/svg+xml" href="/vite.svg" /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {props.css.map((link, index) => <link key={index} rel="stylesheet" href={link} />)}
    </head>
    <body>
      <div id="root">
        <HTMLMetaDataContext.Provider value={html_props}>
          {props.children}
        </HTMLMetaDataContext.Provider>
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `window.PJBLOG_HTML_METADATA = ${JSON.stringify(html_props)};`
      }} type="module"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.PJBLOG_INITIALIZE_STATE = ${JSON.stringify(props.state)};`
      }} type="module"></script>
      <script type="module" src={props.script} />
    </body>
  </html>
}

export function useHTML() {
  return useContext(HTMLMetaDataContext);
}