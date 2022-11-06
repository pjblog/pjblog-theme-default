import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface IConfigState {
  close: boolean;
  description: string;
  name: string;
  theme: string;
}

export async function getConfigs(configs: AxiosRequestConfig = {}) {
  const res = await request.get<IConfigState>('/configs', configs);
  return res.data;
}

getConfigs.namespace = 'configs';