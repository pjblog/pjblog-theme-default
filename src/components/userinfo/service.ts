import type { AxiosRequestConfig } from 'axios';
import { request } from '../request';

export interface IUserInfoState {
  id: number,
  account: string,
  nickname: string,
  email: string,
  avatar: string,
  forbiden: boolean,
  level: number,
  gmt_create: string | Date,
  gmt_modified: string | Date,
}

export function createNewUserInfoState(): IUserInfoState {
  return {
    id: 0,
    account: null,
    nickname: null,
    email: null,
    avatar: null,
    forbiden: false,
    level: 1,
    gmt_create: new Date(),
    gmt_modified: new Date(),
  }
}

export async function getUserInfo(configs: AxiosRequestConfig = {}) {
  const res = await request.get<IUserInfoState>('/me', configs);
  return res.data;
}

getUserInfo.namespace = 'userinfo';

export async function userLogout() {
  const res = await request.delete('/logout');
  return res.data;
}

export async function userLogin(account: string, password: string) {
  const res = await request.put('/login', { account, password });
  return res.data;
}

export async function userRegister(account: string, password: string) {
  const res = await request.post('/user', { account, password });
  return res.data;
}

export async function userProfile(nickname: string, email: string) {
  const res = await request.put('/user', { nickname, email });
  return res.data;
}

export async function userPassword(oldPassword: string, newPassword: string, comPassword: string) {
  const res = await request.put('/me/password', {
    oldPassword, newPassword, comPassword,
  })
  return res.data;
}