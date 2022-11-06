import React, { useCallback } from 'react';
import { useArticlesLocation, useLoginLocation, usePassword } from '../../components';
import styles from './index.module.less';
import { Row, Col, Input, Button, message } from 'antd';

export default function PasswordPage() {
  const { redirect } = useLoginLocation();
  const {
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    comPassword, setComPassword,
    loading, submit,
  } = usePassword();

  const _submit = useCallback(() => {
    submit()
      .then(() => message.success('修改密码成功,需要重新登录'))
      .then(() => redirect())
      .catch(e => {
        switch (e.code) {
          case 406: return message.error('旧密码不匹配');
          default: return message.error(e.message);
        }
      });
  }, [submit, redirect]);

  return <Row gutter={[0, 24]}>
    <Col span={24}>修改密码</Col>
    <Col span={24}>
      <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="旧密码" />
    </Col>
    <Col span={24}>
      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="新密码" />
    </Col>
    <Col span={24}>
      <Input type="password" value={comPassword} onChange={e => setComPassword(e.target.value)} placeholder="重复密码" />
    </Col>
    <Col span={24}>
      <Button type="primary" onClick={_submit} loading={loading}>修改</Button>
    </Col>
  </Row>
}