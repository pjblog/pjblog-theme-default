import React, { Suspense } from 'react';
import { ConfigProvider } from './configs';
import { UserInfoProvider } from './userinfo';

export function BlogProvider(props: React.PropsWithChildren<{ fallback: React.ReactNode }>) {
  return <Suspense fallback={props.fallback}>
    <ConfigProvider>
      <Suspense fallback={props.fallback}>
        <UserInfoProvider>
          {props.children}
        </UserInfoProvider>
      </Suspense>
    </ConfigProvider>
  </Suspense>
}