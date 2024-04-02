import '../markdown.less';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { PropsWithoutRef } from 'react';
import { IDetailPageProps } from '../types';
import { Col, Row } from 'antd';
import { User } from '../components/user';
import { SideList } from '../components/side-list';
import { Article } from './article';
import { Page } from './page';
import { ArticleInfo } from './info';
import { MeContext } from '../utils';

export default function (props: PropsWithoutRef<IDetailPageProps>) {
  const html = useHTML();
  return <MeContext.Provider value={props.me}>
    <Layout
      title={html.title}
      description={html.description}
      categories={props.categories}
      currentCategory={props.media.category.id}
      url={props.location.url}
      icp={html.icp}
      theme={html.theme}
    >
      <Row gutter={40}>
        <Col span={17}>
          {props.media.type === 'article' && <Article
            media={props.media}
            article={props.article}
            token={props.location.params.token}
            page={props.location.query.page}
            url={props.location.url}
          />}
          {props.media.type === 'page' && <Page media={props.media} />}
        </Col>
        <Col span={7}>
          <Row gutter={[0, 24]}>
            {props.media.type === 'article' && <Col span={24}>
              <ArticleInfo media={props.media} article={props.article} />
            </Col>}
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
  </MeContext.Provider>
}