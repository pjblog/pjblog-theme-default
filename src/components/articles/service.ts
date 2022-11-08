import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface IArticlesProps {
  keyword?: string,
  tag?: number,
  category?: number,
  page?: number,
}

export interface IAricle {
  id: number;
  code: string;
  title: string;
  cover: string;
  ctime: string;
  readCount: number;
  mtime: string;
  summary: string;
  category: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
}

export interface TArticleHeading {
  id: string,
  level: number,
  text: string,
}

export interface IArticleDetail {
  id: number;
  title: string;
  ctime: Date;
  mtime: Date;
  readCount: number,
  category: {
    cate_name: string,
    cate_order: number,
    cate_outable: boolean,
    cate_outlink: string,
    gmt_create: string | Date,
    gmt_modified: string | Date,
    id: number,
  };
  tags: {
      name: string;
      id: number;
  }[];
  html: string;
  headings: TArticleHeading[];
  prev: TArticlePreview,
  next: TArticlePreview
}

export interface IArticleState {
  list: IAricle[],
  total: number,
  tag: string,
  category: string,
}

export interface TArticlePreview {
  id: number,
  code: string,
  title: string,
  summary: string,
  ctime: string | Date
}

export async function getHttpArticles(options: IArticlesProps = {}, configs: AxiosRequestConfig = {}) {
  const res = await request.get<IArticleState>('/article', Object.assign(configs, {
    params: options,
  }));
  return res.data;
}

getHttpArticles.namespace = (options: IArticlesProps = {}) => `articles:${options.keyword}:${options.tag || 0}:${options.category || 0}:${options.page || 1}`;

export async function getHttpArticle(id: string, configs: AxiosRequestConfig = {}) {
  const res = await request.get<IArticleDetail>('/article/' + id, configs);
  return res.data;
}

getHttpArticle.namespace = (id: string) => `article:${id}`;

export async function getHttpRelativeArticles(id: number, size: number = 5, configs: AxiosRequestConfig = {}) {
  const res = await request.get<TArticlePreview[]>('/article/' + id + '/relative', Object.assign(configs, {
    params: {
      size
    }
  }))
  return res.data;
}

getHttpRelativeArticles.namespace = (id: number, size: number = 5) => `getRelativeArticles:${id}:${size}`;