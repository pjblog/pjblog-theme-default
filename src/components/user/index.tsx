
import axios from 'axios';
import styles from './index.module.less';
import { IMe } from "@pjblog/blog";
import { PropsWithoutRef } from "react";
import { Space, Typography, message, Avatar, Divider } from 'antd';
import { useMemo } from "react";
import { useCallback } from 'react';
import { useState } from 'react';
import { Side } from '../side';
import { Flex } from '../Flex';
import { Theme } from '../theme';

export function User(props: PropsWithoutRef<{ value: IMe, url: string }>) {
  return <Side title="用户">
    {!!props.value.account ? <Logined {...props.value} /> : <UnLogin url={props.url} />}
  </Side>
}

function Logined(props: PropsWithoutRef<IMe>) {
  const [loading, setLoading] = useState(false)
  const logout = useCallback(() => {
    if (loading) return;
    setLoading(true);
    axios.delete('/-/user/logout')
      .then(() => message.success('退出成功'))
      .then(() => window.location.reload())
      .catch(e => message.error(e.message))
      .finally(() => setLoading(false));
  }, [loading])
  return <div>
    <Flex gap={8} className={styles.user}>
      <Avatar src={props.avatar} size={42} shape="square" />
      <Flex span={1} direction="vertical">
        <Typography.Text>{props.nickname}</Typography.Text>
        <Theme>
          <div>
            <Typography.Text type="secondary">@{props.account}</Typography.Text>
            <Divider type="vertical" />
            <Typography.Text type="secondary">{props.admin ? '管理员' : '普通成员'}</Typography.Text>
            {!!props.website && <>
              <Divider type="vertical" />
              <Typography.Link href={props.website} target="_blank">博客</Typography.Link>
            </>}
          </div>
        </Theme>
      </Flex>
    </Flex>
    <ul className={styles.list}>
      {props.admin && <li><Typography.Link href="/control">后台管理</Typography.Link></li>}
      <li><Typography.Link href="/control/profile">修改资料</Typography.Link></li>
      <li><Typography.Link href="/control/password">修改密码</Typography.Link></li>
      <li><Typography.Link onClick={logout} disabled={loading}>退出登录</Typography.Link></li>
    </ul>
  </div>
}

function UnLogin(props: PropsWithoutRef<{ url: string }>) {
  const loginUrl = useMemo(() => `/control/login?redirect_url=${encodeURIComponent(props.url)}`, [props.url]);
  const registerUrl = useMemo(() => `/control/register?redirect_url=${encodeURIComponent(props.url)}`, [props.url]);
  return <ul className={styles.list}>
    <li><Typography.Link href={loginUrl}>登录</Typography.Link></li>
    <li><Typography.Link href={registerUrl}>注册</Typography.Link></li>
  </ul>
}