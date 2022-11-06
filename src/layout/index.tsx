import React, { Suspense } from 'react';
import styles from './index.module.less';
import { useConfigs } from '../components';
import { Close } from './close';
import { Typography, Row, Col } from 'antd';
import { UserPannel } from './user-pannel';
import { CategoryPannel } from './category-pannel';
import { LinkPannel } from './link-pannel';

export function Layout(props: React.PropsWithChildren<{}>) {
  const { data } = useConfigs();
  if (data.close) return <Close />;
  return <div className={styles.container}>
    <div className={styles.headbar}>
      <Typography.Title level={1}>{data.name}</Typography.Title>
      <Typography.Paragraph>{data.description}</Typography.Paragraph>
    </div>
    <div className={styles.bodybar}>
    <Row gutter={[24, 24]}>
      <Col span={17}>
        {props.children}
      </Col>
      <Col span={7}>
        <Row gutter={[24, 24]}>
          <Col span={24}><UserPannel /></Col>
          <Col span={24}>
            <Suspense fallback="loading...">
              <CategoryPannel />
            </Suspense>
          </Col>
          <Col span={24}>
            <Suspense fallback="loading...">
              <LinkPannel />
            </Suspense>
          </Col>
        </Row>
      </Col>
    </Row>
    </div>
  </div>
}