import { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface IComment {
  id: number,
  html: string,
  ip: string,
  ctime: string | Date,
  rid: number,
  user: {
    id: number,
    nickname: string,
    account: string,
    avatar: string,
    level: number,
  },
  article: {
    id: number,
    title: string,
    code: string,
  },
  replies?: IComment[],
}

export interface ICommentState { 
  list: IComment[], 
  total: number 
}

export async function setHttpComment(aid: number, pid: number, text: string) {
  const res = await request.post<IComment>('/comment', {
    aid, pid, text,
  })
  return res.data;
}

export async function getHttpComments(aid: number, index: number = 0, configs: AxiosRequestConfig = {}) {
  const res = await request.get<{ list: IComment[], total: number }>(`/article/${aid}/comments`, Object.assign(configs, {
    params: {
      index
    }
  }));
  return res.data;
}

getHttpComments.namespace = (aid: number, index: number = 0) => `comments:${aid}:index:${index}`;