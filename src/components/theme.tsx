import { PropsWithChildren } from "react";
import { ConfigProvider } from 'antd';

export function Theme(props: PropsWithChildren<{
  size?: number
}>) {
  return <ConfigProvider
    theme={{
      token: {
        fontSize: props.size || 12,
      },
    }}
  >{props.children}</ConfigProvider>
}