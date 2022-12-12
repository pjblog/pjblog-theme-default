import styles from './index.module.less';
import { usePassword, useReloadMyInfo } from '@pjblog/hooks';
import { Input, Button, Typography, Space, message } from 'antd';
import { useCallback } from 'react';
import { usePath } from '../../hooks';
export default function Password() {
  const reload = useReloadMyInfo();
  const LOGIN = usePath('LOGIN');
  const {
    newPassword, setNewPassword,
    oldPassword, setOldPassword,
    comPassword, setComPassword,
    execute, loading,
  } = usePassword();

  const submit = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('修改密码成功，您需要重新登录!'))
      .then(() => LOGIN.redirect())
      .catch(e => message.error(e.message));
  }, [execute, reload])

  return <div className={styles.password}>
    <Typography.Title level={3}>修改密码</Typography.Title>
    <Space direction="vertical" size={16}>
      <Input.Password autoFocus value={oldPassword} placeholder="旧密码" onChange={e => setOldPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Input.Password value={newPassword} placeholder="新密码" onChange={e => setNewPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Input.Password value={comPassword} placeholder="确认密码" onChange={e => setComPassword(e.target.value)} style={{ width: 400 }} size="large" />
      <Button block type="primary" htmlType="submit" onClick={submit} loading={loading} size="large">修改</Button>
    </Space>
  </div>
}