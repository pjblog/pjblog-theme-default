/// <reference types="vite/client" />
import { IMe } from '@pjblog/blog';
var PJBLOG_INITIALIZE_STATE: any;

interface IHomePageProps {
  metadata: IBlogMetaData,
  page: number,
  type?: string,
  category?: number,
  me: IMe,
  medias: IHomePageMedia[],
}

interface IHomePageMedia {
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

interface IHtmlMetaData {
  title: string;
  description: string;
  keywords: string[];
  domain: string;
}

interface IBlogMetaData {
  theme: string;
  icp: string;
  close: boolean;
  reason: string;
  registable: boolean;
  commentable: boolean;
}

interface IHtmlProps extends IHtmlMetaData {
  dev?: boolean,
  state: any,
  script: string,
  css?: string[],
}