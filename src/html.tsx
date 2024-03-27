import { PropsWithChildren, createContext, useContext } from "react";
import { IHtmlProps, IMetaData } from "./types";

const HTMLMetaDataContext = createContext<IMetaData>(
  typeof window !== 'undefined'
    ? window.PJBLOG_HTML_METADATA
    : {
      title: null,
      description: null,
      keywords: [],
      domain: null,
      theme: null,
      icp: null,
      close: false,
      reason: null,
      registable: false,
      commentable: false,
    }
)

// vite 专属内容
const HMRContent = `import RefreshRuntime from '/@react-refresh';RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;window.__vite_plugin_react_preamble_installed__ = true;`;

export default (props: PropsWithChildren<IHtmlProps>) => {
  const { dev, state, script, css = [], children, ...metadata } = props;
  return <html lang="en">
    <head>
      <title>{metadata.title}</title>
      {!!dev && <script dangerouslySetInnerHTML={{ __html: HMRContent }} type="module"></script>}
      {!!dev && <script type="module" src="/@vite/client"></script>}
      <meta charSet="UTF-8" />
      <meta name="keywords" content={metadata.keywords.join(',')} />
      <meta name="description" content={metadata.description} />
      <meta name="domain" content={metadata.domain} />
      {/* <link rel="icon" type="image/svg+xml" href="/vite.svg" /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {css.map((link, index) => <link key={index} rel="stylesheet" href={link} />)}
    </head>
    <body>
      <div id="root">
        <HTMLMetaDataContext.Provider value={metadata}>
          {children}
        </HTMLMetaDataContext.Provider>
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `window.PJBLOG_HTML_METADATA = ${JSON.stringify(metadata)};`
      }} type="module"></script>
      <script dangerouslySetInnerHTML={{
        __html: `window.PJBLOG_INITIALIZE_STATE = ${JSON.stringify(state)};`
      }} type="module"></script>
      {!!script && <script type="module" src={script} />}
    </body>
  </html>
}

export function useHTML() {
  return useContext(HTMLMetaDataContext);
}