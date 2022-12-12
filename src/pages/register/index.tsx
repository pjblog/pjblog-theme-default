import styles from './index.module.less';
import { useRegister, useReloadMyInfo } from '@pjblog/hooks';
import { Input, Button, Typography, Space, message } from 'antd';
import { useCallback } from 'react';
import { usePath } from '../../hooks';
export default function Register() {
  const HOME = usePath('HOME');
  const reload = useReloadMyInfo()
  const {
    account, setAccount,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    execute, loading,
  } = useRegister();

  const submit = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('注册成功'))
      .then(() => HOME.redirect())
      .catch(e => message.error(e.message));
  }, [execute, reload])

  return <div className={styles.register}>
    <Typography.Title level={3}>注册新账号</Typography.Title>
    <Space direction="vertical" size={16}>
      <Input value={account} placeholder="账号" autoFocus onChange={e => setAccount(e.target.value)} style={{ width: 400 }} size="large" />
      <Input.Password value={password} placeholder="密码" onChange={e => setPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Input.Password value={confirmPassword} placeholder="确认密码" onChange={e => setConfirmPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Button block type="primary" htmlType="submit" onClick={submit} loading={loading} size="large">注册</Button>
    </Space>
  </div>
}