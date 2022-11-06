import React, { useCallback } from 'react';
import styles from './index.module.less';
import { Card, Typography, Avatar, message } from 'antd';
import { useLoginLocation, useLogout, usePasswordLocation, useProfileLocation, useRegisterLocation, useUserInfo } from '../../components';
import { Flex } from '../../lib';

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
  const registerLocation = useRegisterLocation();
  const loginLocation = useLoginLocation();
  return <ul>
    <li>您还没有登录！</li>
    <li><Typography.Link onClick={() => loginLocation.redirect()}>登录</Typography.Link></li>
    <li><Typography.Link onClick={() => registerLocation.redirect()}>注册</Typography.Link></li>
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
  const logout = useLogout();
  const _logout = useCallback(() => {
    logout.logout()
      .then(() => message.success('退出登录成功'))
      .catch(e => message.error(e.message));
  }, [logout.logout])
  return <Typography.Link onClick={_logout} disabled={logout.loading}>退出登录</Typography.Link>;
}

function Profile() {
  const { redirect } = useProfileLocation();
  return <Typography.Link onClick={redirect}>修改资料</Typography.Link>;
}

function Password() {
  const { redirect } = usePasswordLocation();
  return <Typography.Link onClick={redirect}>修改密码</Typography.Link>;
}