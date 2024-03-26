import { IMe } from '@pjblog/blog';

export interface IHomePageProps {
  metadata: IBlogMetaData,
  page: number,
  type?: string,
  category?: number,
  me: IMe,
  url: string,
  medias: IHomePageMedia[],
  categories: ICategory[]
}

export interface IHomePageMedia {
  token: string;
  title: string;
  category: {
    id: number;
    name: number;
  };
  description: string;
  user: {
    account: string;
    nickname: string;
    avatar: string;
  };
  readCount: number;
  type: string;
  gmtc: string;
}

export interface IHtmlMetaData {
  title: string;
  description: string;
  keywords: string[];
  domain: string;
}

export interface IBlogMetaData {
  theme: string;
  icp: string;
  close: boolean;
  reason: string;
  registable: boolean;
  commentable: boolean;
}

export interface IHtmlProps extends IHtmlMetaData {
  url: string,
  dev?: boolean,
  state: any,
  script: string,
  css?: string[],
}

export interface ICategory {
  id: number;
  name: string;
  outable: boolean;
  link: string;
}