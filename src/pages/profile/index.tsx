import styles from './index.module.less';
import { useProfile, useReloadMyInfo } from '@pjblog/hooks';
import { Input, Button, Typography, Space, message } from 'antd';
import { useCallback } from 'react';
export default function Profile() {
  const reload = useReloadMyInfo()
  const {
    nickname, setNickname,
    email, setEmail,
    avatar, setAvatar,
    website, setWebsite,
    execute, loading,
  } = useProfile();

  const submit = useCallback(() => {
    execute()
      .then(reload)
      .then(() => message.success('更新用户资料成功'))
      .catch(e => message.error(e.message));
  }, [execute, reload])

  return <div className={styles.profile}>
    <Typography.Title level={3}>完善用户资料</Typography.Title>
    <Space direction="vertical" size={16}>
      <Input value={nickname} placeholder="昵称" autoFocus onChange={e => setNickname(e.target.value)} style={{ width: 400 }} size="large" />
      <Input value={email} placeholder="邮箱" autoFocus onChange={e => setEmail(e.target.value)} style={{ width: 400 }} size="large" type="email" />
      <Input value={avatar} placeholder="头像网络地址" autoFocus onChange={e => setAvatar(e.target.value)} style={{ width: 400 }} size="large" />
      <Input value={website} placeholder="个人网站" autoFocus onChange={e => setWebsite(e.target.value)} style={{ width: 400 }} size="large" />
      <Button block type="primary" htmlType="submit" onClick={submit} loading={loading} size="large">保存</Button>
    </Space>
  </div>
}