import styles from './index.module.less';
import { useLogin, useReloadMyInfo } from '@pjblog/hooks';
import { Input, Button, Typography, Space, message } from 'antd';
import { useCallback } from 'react';
import { usePath } from '../../hooks';
export default function Login() {
  const HOME = usePath('HOME');
  const reload = useReloadMyInfo()
  const {
    account, setAccount,
    password, setPassword,
    execute, loading,
  } = useLogin();

  const submit = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('登录成功'))
      .then(() => HOME.redirect())
      .catch(e => message.error(e.message));
  }, [execute, reload])

  return <div className={styles.login}>
    <Typography.Title level={3}>通过账号密码登录</Typography.Title>
    <Space direction="vertical" size={16}>
      <Input value={account} placeholder="账号" autoFocus onChange={e => setAccount(e.target.value)} style={{ width: 400 }} size="large" />
      <Input.Password value={password} placeholder="密码" onChange={e => setPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Button block type="primary" htmlType="submit" onClick={submit} loading={loading} size="large">登录</Button>
    </Space>
  </div>
}