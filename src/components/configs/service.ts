import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface IConfigState {
  close: boolean;
  description: string;
  name: string;
  theme: string;
  article_size: number, 
  comment_size: number,
}

export function createDetaultConfigs(): IConfigState {
  return {
    close: false,
    description: null,
    name: null,
    theme: 'pjblog-theme-default',
    article_size: 10,
    comment_size: 10,
  }
}

export async function getHttpConfigs(configs: AxiosRequestConfig = {}) {
  const res = await request.get<IConfigState>('/configs', configs);
  return res.data;
}

getHttpConfigs.namespace = 'configs';