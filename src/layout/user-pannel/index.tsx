import React, { useCallback } from 'react';
import styles from './index.module.less';
import { Card, Typography, Avatar, message } from 'antd';
import { useLogout, useUserInfo } from '../../components';
import { Flex } from '../../lib';
import { redirect } from '@codixjs/codix';

export function UserPannel() {
  const user = useUserInfo();
  return <Card title="用户信息" size="small">
    {
      user.id > 0
        ? <Logined />
        : <NotLogin />
    }
  </Card>
}

function NotLogin() {
  return <ul>
    <li>您还没有登录！</li>
    <li><Typography.Link onClick={() => redirect('/login')}>登录</Typography.Link></li>
    <li><Typography.Link onClick={() => redirect('/register')}>注册</Typography.Link></li>
  </ul>
}

function Logined() {
  const user = useUserInfo();
  return <ul className={styles.ul}>
    <li>
      <Flex gap={12}>
        <Avatar src={user.avatar} shape="square" size="large" />
        <div>
          <div>{user.nickname}</div>
          <div>@{user.account}</div>
        </div>
      </Flex>
    </li>
    <li><Profile /></li>
    <li><Password /></li>
    <li>
      <Logout />
    </li>
    {
      user.level === 0
        ? <li><Typography.Link href="/control/" target="_blank">进入后台</Typography.Link></li>
        : null
    }
  </ul>
}

function Logout() {
  const { logout, loading } = useLogout();
  const _logout = useCallback(() => {
    logout()
      .then(() => message.success('退出登录成功'))
      .catch(e => message.error(e.message));
  }, [logout])
  return <Typography.Link onClick={_logout} disabled={loading}>退出登录</Typography.Link>;
}

function Profile() {
  return <Typography.Link onClick={() => redirect('/profile')}>修改资料</Typography.Link>;
}

function Password() {
  return <Typography.Link onClick={() => redirect('/password')}>修改密码</Typography.Link>;
}