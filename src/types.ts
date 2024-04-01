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
  categories: ICategory[],
  archives: IArchive[],
}

export interface IDetailPageProps {
  me: IMe,
  location: {
    url: string,
    query: {
      page?: number,
    },
    params: {
      token: string,
    }
  }
  hots: ISideMedia[],
  latests: ISideMedia[],
  categories: ICategory[],
  media: IMedia,
  article?: IArticle,
}

export interface IArchivePageProps {
  me: IMe,
  location: {
    url: string,
    query: {
      page?: number,
      type?: string,
      category?: number,
    },
    params: {
      year: number,
      month?: number,
      day?: number,
    }
  }
  medias: {
    data: IHomePageMedia[],
    total: number,
    size: number,
  },
  hots: ISideMedia[],
  latests: ISideMedia[],
  categories: ICategory[],
}

export interface IMedia {
  title: string,
  category: ICategory,
  user: IUser,
  readCount: number,
  type: string,
  commentable: boolean,
  gmtc: string | Date,
  gmtm: string | Date,
  description?: string,
}

export interface IArticle {
  md5: string,
  markdown: string,
  source: string[],
  tags: ITag[],
  comments: {
    data: IComment[],
    total: number,
    rootSize: number,
    childSize: number,
    commentable: boolean,
  }
}

export interface ITag {
  id: number,
  name: string,
}

export interface IUser {
  account: string;
  nickname: string;
  avatar: string;
}

export interface IHomePageMedia {
  token: string;
  title: string;
  category: {
    id: number;
    name: number;
  };
  description: string;
  user: IUser;
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
  outable?: boolean;
  link?: string;
}

export interface ISideMedia {
  token: string;
  type: string;
  title: string;
  gmtc: Date;
}

export interface IArchive {
  year: number,
  month: number,
  count: number,
}

export interface IComment {
  id: number,
  content: string,
  gmtc: string | Date,
  gmtm: string | Date,
  children: number,
  parent: number,
  user: {
    avatar: string,
    nickname: string,
    account: string,
  }
}