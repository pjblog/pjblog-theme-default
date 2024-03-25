import { PropsWithChildren } from "react";
import { IHtmlProps } from "./vite-env";

// vite 专属内容
const HMRContent = `import RefreshRuntime from '/@react-refresh';RefreshRuntime.injectIntoGlobalHook(window);window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;window.__vite_plugin_react_preamble_installed__ = true;`;

export default (props: PropsWithChildren<IHtmlProps>) => {
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
      <script dangerouslySetInnerHTML={{ __html: `window.PJBLOG_INITIALIZE_STATE = ${JSON.stringify(props.state)};` }} type="module"></script>
    </head>
    <body>
      <div id="root">
        {props.children}
      </div>
      <script type="module" src={props.script} />
    </body>
  </html>
}