import React, { useCallback } from 'react';
import { useArticlesLocation, useProfile } from '../../components';
import styles from './index.module.less';
import { Row, Col, Input, Button, message } from 'antd';

export default function ProfilePage() {
  const articleRedirection = useArticlesLocation();
  const {
    nickname, setNickname,
    email, setEmail,
    avatar, setAvatar,
    loading, submit,
  } = useProfile();

  const _submit = useCallback(() => {
    submit()
      .then(() => message.success('更新用户信息成功'))
      .then(() => articleRedirection.redirect())
      .catch(e => message.error(e.message));
  }, [submit, articleRedirection.redirect]);

  return <Row gutter={[0, 24]}>
    <Col span={24}>更新用户信息</Col>
    <Col span={24}>
      <Input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="昵称" />
    </Col>
    <Col span={24}>
      <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱" />
    </Col>
    <Col span={24}>
      <Input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="头像" />
    </Col>
    <Col span={24}>
      <Button type="primary" onClick={_submit} loading={loading}>保存</Button>
    </Col>
  </Row>
}