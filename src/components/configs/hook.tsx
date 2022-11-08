import { useAsync } from '@codixjs/fetch';
import React, { createContext, useContext } from 'react';
import { useRequestConfigs } from '../request';
import { getHttpConfigs, createDetaultConfigs } from './service';

export const ConfigsContext = createContext(createDetaultConfigs());

export function useHttpConfigs() {
  const configs = useRequestConfigs();
  return useAsync(getHttpConfigs.namespace, () => getHttpConfigs(configs));
}

export function ConfigProvider(props: React.PropsWithChildren<{}>) {
  const { data } = useHttpConfigs();
  return <ConfigsContext.Provider value={data}>{props.children}</ConfigsContext.Provider>
}

export function useConfigs() {
  return useContext(ConfigsContext);
}