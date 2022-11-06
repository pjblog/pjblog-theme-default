import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface ILink {
  id: number,
  name: string,
  url: string,
  icon: string,
}

export async function getLinks(configs: AxiosRequestConfig = {}, size: number = 0) {
  if (size) {
    configs.params = {
      size,
    }
  }
  const res = await request.get<ILink[]>('/link', configs);
  return res.data;
}

export async function addLink(name: string, icon: string, url: string) {
  const res = await request.post('/link', { name, icon, url });
  return res.data;
}