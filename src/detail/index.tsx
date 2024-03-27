import '../markdown.less';
import styles from './index.module.less';
import classnames from 'classnames';
import { parse } from 'marked';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { PropsWithoutRef, useMemo } from 'react';
import { IDetailPageProps } from '../types';
import { Col, Row, Tag, Typography } from 'antd';
import { User } from '../components/user';
import { SideList } from '../components/side-list';

export default function (props: PropsWithoutRef<IDetailPageProps>) {
  const html = useHTML();
  const content = useMemo(() => parse(props.article.markdown), [props.article.markdown]);
  return <Layout
    title={html.title}
    description={html.description}
    categories={props.categories}
    currentCategory={props.media.category}
    url={props.location.url}
  >
    <Row gutter={40}>
      <Col span={17}>
        <Typography.Title level={2}>{props.media.title}</Typography.Title>
        <div className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)} dangerouslySetInnerHTML={{ __html: content }} />
        {/* <div>{JSON.stringify(props.media)}</div>
        <div>{JSON.stringify(props.article)}</div> */}
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