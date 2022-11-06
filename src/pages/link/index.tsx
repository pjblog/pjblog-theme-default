import React, { useCallback } from 'react';
import { ILink, useLink, useLinks, useUserInfo } from '../../components';
import styles from './index.module.less';
import { Row, Col, Typography, Card, Input, Button, message } from 'antd';

export default function LinkPage() {
  const { data } = useLinks();
  const user = useUserInfo();
  return <Row gutter={[24, 24]}>
    <Col span={24}>友情链接</Col>
    {
      data.map(value => <Item {...value} key={value.id} />)
    }
    {
      user.id > 0
        ? <Poster />
        : null
    }
  </Row>
}

function Item(props: React.PropsWithoutRef<ILink>) {
  return <Col span={6}>
    <Typography.Link href={props.url} target="_blank" className={styles.link}>
      <img src={props.icon} alt={props.name} />
    </Typography.Link>
  </Col>
}

function Poster() {
  const {
    name, setName,
    icon, setIcon,
    url, setUrl,
    loading, submit
  } = useLink();
  const _submit = useCallback(() => {
    submit()
    .then(() => message.success('申请成功，等待管理员通过'))
    .catch(e => message.error(e.message));
  }, [submit])
  return <Col span={24}>
    <Card title="申请友情链接">
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Input placeholder="友情链接名" value={name} onChange={e => setName(e.target.value)} />
        </Col>
        <Col span={24}>
          <Input placeholder="友情链接图标地址" value={icon} onChange={e => setIcon(e.target.value)} />
        </Col>
        <Col span={24}>
          <Input placeholder="友情链接地址" value={url} onChange={e => setUrl(e.target.value)} />
        </Col>
        <Col span={24}>
          <Button type="primary" loading={loading} onClick={_submit}>提交申请</Button>
        </Col>
      </Row>
    </Card>
  </Col>
}