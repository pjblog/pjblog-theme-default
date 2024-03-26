import '../markdown.less';
import styles from './index.module.less';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { parse } from 'marked';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { IHomePageMedia, IHomePageProps } from '../types';
import { PropsWithoutRef } from 'react';
import { Row, Col, Typography, Space, Avatar, Divider } from 'antd';
import { useMemo } from 'react';
import { User } from '../components/user';

export default function (props: PropsWithoutRef<{
  state: IHomePageProps,
}>) {
  const html = useHTML();
  return <Layout title={html.title} description={html.description} categories={props.state.categories} currentCategory={props.state.category}>
    <Row gutter={24}>
      <Col span={17}>
        <Row gutter={[0, 48]}>
          {
            props.state.medias.map(media => {
              return <Col span={24} key={media.token}>
                <Media {...media} />
              </Col>
            })
          }
        </Row>
      </Col>
      <Col span={7}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <User value={props.state.me} />
          </Col>
        </Row>
      </Col>
    </Row>
  </Layout>
}

function Media(props: PropsWithoutRef<IHomePageMedia>) {
  const html = useMemo(() => parse(props.description), [props.description]);
  return <div className={styles.media}>
    <Typography.Title level={2} className={styles.title}>{props.title}</Typography.Title>
    <Space>
      <Space>
        <Avatar src={props.user.avatar} size={24} />
        <Typography.Text type="secondary">{props.user.nickname}</Typography.Text>
      </Space>
      <Typography.Text type="secondary">发表于 {dayjs(props.gmtc).format('YYYY-MM-DD HH:mm')}</Typography.Text>
      <Typography.Link href={'/?category=' + props.category.id}>{props.category.name}</Typography.Link>
      <Divider type="vertical" />
      <Typography.Text type="secondary">阅读量 {props.readCount}</Typography.Text>
    </Space>
    <div className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)} dangerouslySetInnerHTML={{ __html: html }} />
  </div>
}