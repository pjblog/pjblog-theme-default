import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface ILink {
  id: number,
  name: string,
  url: string,
  icon: string,
}

export async function getHttpLinks(configs: AxiosRequestConfig = {}, size: number = 0) {
  if (size) {
    configs.params = {
      size,
    }
  }
  const res = await request.get<ILink[]>('/link', configs);
  return res.data;
}

getHttpLinks.namespace = (size: number = 0) => `links:${size}`

export async function setHttpLink(name: string, icon: string, url: string) {
  const res = await request.post('/link', { name, icon, url });
  return res.data;
}