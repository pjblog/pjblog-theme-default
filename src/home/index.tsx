import '../markdown.less';
import styles from './index.module.less';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { parse } from 'marked';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { IHomePageMedia, IHomePageProps } from '../types';
import { PropsWithoutRef } from 'react';
import { Row, Col, Typography, Space, Avatar, Divider, Pagination } from 'antd';
import { useMemo } from 'react';
import { User } from '../components/user';
import { SideList } from '../components/side-list';
import { Theme } from '../components/theme';
import { Flex } from '../components/Flex';

export default function (props: PropsWithoutRef<IHomePageProps>) {
  const html = useHTML();
  return <Layout
    title={html.title}
    description={html.description}
    categories={props.categories}
    currentCategory={props.location.query.category}
    url={props.location.url}
  >
    <Row gutter={40}>
      <Col span={17}>
        <Row gutter={[0, 48]}>
          {
            props.medias.data.map(media => {
              return <Col span={24} key={media.token}>
                <Media {...media} />
              </Col>
            })
          }
          <Col span={24}>
            <Pagination
              current={props.location.query.page}
              pageSize={props.medias.size}
              total={props.medias.total}
              onChange={page => {
                const URI = new URL('http://localhost' + props.location.url);
                URI.searchParams.set('page', page + '');
                window.location.href = URI.pathname + URI.search;
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col span={7}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <User value={props.me} url={props.location.url} />
          </Col>
          <Col span={24}>
            <SideList value={props.hots} title="热门文章" />
          </Col>
          <Col span={24}>
            <SideList value={props.latests} title="最新文章" />
          </Col>
        </Row>
      </Col>
    </Row>
  </Layout>
}

function Media(props: PropsWithoutRef<IHomePageMedia>) {
  const html = useMemo(() => parse(props.description), [props.description]);
  return <div className={styles.media}>
    <Typography.Link className={styles.title} href={'/' + props.token}>{props.title}</Typography.Link>
    <div className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)} dangerouslySetInnerHTML={{ __html: html }} />
    <Theme>
      <Flex valign="middle">
        <Flex gap={4} valign="middle">
          <Space size={2}>
            <Avatar src={props.user.avatar} size={18} />
            <Typography.Text type="secondary">{props.user.nickname}</Typography.Text>
          </Space>
          <Typography.Text type="secondary">发表于 {dayjs(props.gmtc).format('YYYY-MM-DD HH:mm')}</Typography.Text>
        </Flex>
        <Divider type="vertical" />
        <Typography.Link href={'/?category=' + props.category.id}>{props.category.name}</Typography.Link>
        <Divider type="vertical" />
        <Typography.Text type="secondary">阅读量 {props.readCount}</Typography.Text>
      </Flex>
    </Theme>
  </div>
}