
import axios from 'axios';
import { IMe } from "@pjblog/blog";
import { PropsWithoutRef } from "react";
import { Card, Space, Typography, message } from 'antd';
import { useMemo } from "react";
import { useHTML } from "../../html";
import { useCallback } from 'react';
import { useState } from 'react';

export function User(props: PropsWithoutRef<{ value: IMe }>) {
  return <Card title="用户" size="small">
    {!!props.value.account ? <Logined {...props.value} /> : <UnLogin />}
  </Card>
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
  return <Space direction="vertical">
    {props.admin && <Typography.Link href="/control">后台管理</Typography.Link>}
    <Typography.Link href="/control/profile">修改资料</Typography.Link>
    <Typography.Link href="/control/password">修改密码</Typography.Link>
    <Typography.Link onClick={logout} disabled={loading}>退出登录</Typography.Link>
  </Space>
}

function UnLogin() {
  const html = useHTML();
  const loginUrl = useMemo(() => `/control/login?redirect_url=${encodeURIComponent(html.url)}`, [html.url]);
  const registerUrl = useMemo(() => `/control/register?redirect_url=${encodeURIComponent(html.url)}`, [html.url]);
  return <Space direction="vertical">
    <Typography.Link href={loginUrl}>登录</Typography.Link>
    <Typography.Link href={registerUrl}>注册</Typography.Link>
  </Space>
}