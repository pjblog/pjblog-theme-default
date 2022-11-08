import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface ICategory {
  count: string,
  id: number,
  name: string,
  order: number,
  outable: boolean,
  outlink: string,
}

export async function getHttpCategories(configs: AxiosRequestConfig = {}) {
  const res = await request.get<ICategory[]>('/category', configs);
  return res.data;
}

getHttpCategories.namespace = 'categories';