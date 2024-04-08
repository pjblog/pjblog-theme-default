import '../markdown.less';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { PropsWithoutRef } from 'react';
import { IDetailPageProps } from '../types';
import { User } from '../components/user';
import { SideList } from '../components/side-list';
import { Article } from './article';
import { Page } from './page';
import { ArticleInfo } from './info';
import { MeContext } from '../utils';
import { Flex } from '../components/Flex';

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
      <Flex block gap={48}>
        <Flex span={1} scroll="hide" direction="vertical">
          {props.media.type === 'article' && <Article
            media={props.media}
            article={props.article}
            token={props.location.params.token}
            page={props.location.query.page}
            url={props.location.url}
          />}
          {props.media.type === 'page' && <Page media={props.media} />}
        </Flex>
        <div className="sidebar">
          {props.media.type === 'article' && <ArticleInfo media={props.media} article={props.article} />}
          <User value={props.me} url={props.location.url} />
          <SideList value={props.hots} title="热门文章" />
          <SideList value={props.latests} title="最新文章" />
        </div>
      </Flex>
    </Layout>
  </MeContext.Provider>
}