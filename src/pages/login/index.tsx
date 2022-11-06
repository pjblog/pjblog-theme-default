import React, { useCallback } from 'react';
import { useLogin, useArticlesLocation } from '../../components';
import styles from './index.module.less';
import { Row, Col, Input, Button, message } from 'antd';

export default function LoginPage() {
  const articleRedirection = useArticlesLocation();
  const {
    account, setAccount,
    password, setPassword,
    loading, submit,
  } = useLogin();

  const _submit = useCallback(() => {
    submit()
      .then(() => message.success('登录成功'))
      .then(() => articleRedirection.redirect())
      .catch(e => message.error(e.message));
  }, [submit, articleRedirection.redirect]);

  return <Row gutter={[0, 24]}>
    <Col span={24}>登录</Col>
    <Col span={24}>
      <Input value={account} onChange={e => setAccount(e.target.value)} placeholder="账号" />
    </Col>
    <Col span={24}>
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" />
    </Col>
    <Col span={24}>
      <Button type="primary" onClick={_submit} loading={loading}>登录</Button>
    </Col>
  </Row>
}