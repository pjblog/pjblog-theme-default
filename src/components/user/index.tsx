
import axios from 'axios';
import styles from './index.module.less';
import { IMe } from "@pjblog/blog";
import { PropsWithoutRef } from "react";
import { useMemo } from "react";
import { useCallback } from 'react';
import { useState } from 'react';
import { Side } from '../side';
import { Flex } from '../Flex';
import { Avatar } from '../avatar';
import { ToastProvider, useToasts } from 'react-toast-notifications';


export function User(props: PropsWithoutRef<{ value: IMe, url: string }>) {
  return <ToastProvider>
    <Side title="用户">
      {!!props.value.account ? <Logined {...props.value} /> : <UnLogin url={props.url} />}
    </Side>
  </ToastProvider>
}

function Logined(props: PropsWithoutRef<IMe>) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const logout = useCallback(() => {
    if (loading) return;
    setLoading(true);
    axios.delete('/-/user/logout')
      .then(() => window.location.reload())
      .catch(e => addToast(e.message, { appearance: 'error', autoDismiss: true }))
      .finally(() => setLoading(false));
  }, [loading])
  return <div>
    <Flex gap={8} className={styles.user} valign="middle">
      <Avatar src={props.avatar} size={42} shape="square" />
      <Flex span={1} direction="vertical" valign="middle">
        <span className={styles.nickname}>{props.nickname}</span>
        <Flex className={styles.info} gap={8}>
          <span>@{props.account}</span>
          <span>{props.admin ? '管理员' : '普通成员'}</span>
          {!!props.website && <a href={props.website} target="_blank">博客</a>}
        </Flex>
      </Flex>
    </Flex>
    <ul className={styles.list}>
      {props.admin && <li><a href="/control">后台管理</a></li>}
      <li><a href="/control/profile">修改资料</a></li>
      <li><a href="/control/password">修改密码</a></li>
      <li><a href="javascript:void(0);" onClick={logout}>退出登录</a></li>
    </ul>
  </div>
}

function UnLogin(props: PropsWithoutRef<{ url: string }>) {
  const loginUrl = useMemo(() => `/control/login?redirect_url=${encodeURIComponent(props.url)}`, [props.url]);
  const registerUrl = useMemo(() => `/control/register?redirect_url=${encodeURIComponent(props.url)}`, [props.url]);
  return <ul className={styles.list}>
    <li><a href={loginUrl}>登录</a></li>
    <li><a href={registerUrl}>注册</a></li>
  </ul>
}