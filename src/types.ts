import { IMe } from '@pjblog/blog';

export interface IHomePageProps {
  me: IMe,
  location: {
    url: string,
    query: {
      page?: number,
      type?: string,
      category?: number,
    }
  }
  medias: {
    data: IHomePageMedia[],
    total: number,
    size: number,
  },
  hots: ISideMedia[],
  latests: ISideMedia[],
  categories: ICategory[]
}

export interface IDetailPageProps {
  me: IMe,
  location: {
    url: string,
    query: {
      page?: number,
      token: string,
    }
  }
  hots: ISideMedia[],
  latests: ISideMedia[],
  categories: ICategory[],
  media: {
    title: string,
    category: number,
    user: number,
    readCount: number,
    type: string,
    commentable: boolean,
    gmtc: string | Date,
    gmtm: string | Date,
  },
  article?: IArticle,
}

export interface IArticle {
  md5: string,
  markdown: string,
  source: string[],
  tags: ITag[],
}

export interface ITag {
  id: number,
  name: string,
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

export interface IMetaData {
  title: string;
  description: string;
  keywords: string[];
  domain: string;
  theme: string;
  icp: string;
  close: boolean;
  reason: string;
  registable: boolean;
  commentable: boolean;
}

export interface IHtmlProps extends IMetaData {
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

export interface ISideMedia {
  token: string;
  type: string;
  title: string;
  gmtc: Date;
}