import '../markdown.less';
import 'rc-pagination/assets/index.less';
import styles from './index.module.less';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Pagination from 'rc-pagination';
import { parse } from 'marked';
import { useHTML } from '../html';
import { Layout } from '../layout';
import { IHomePageMedia, IHomePageProps } from '../types';
import { PropsWithoutRef } from 'react';
import { useMemo } from 'react';
import { User } from '../components/user';
import { SideList } from '../components/side-list';
import { Flex } from '../components/Flex';
import { SideArchive } from '../components/archive';
import { Avatar } from '../components/avatar';

// @ts-ignore
const Paginations = (Pagination?.default || Pagination) as typeof Pagination;

export default function (props: PropsWithoutRef<IHomePageProps>) {
  const html = useHTML();
  return <Layout
    title={html.title}
    description={html.description}
    categories={props.categories}
    currentCategory={props.location.query.category}
    url={props.location.url}
    icp={html.icp}
    theme={html.theme}
  >
    <Flex block gap={48}>
      <Flex span={1} scroll="hide" direction="vertical">
        {props.medias.data.map(media => <Media key={media.token} {...media} />)}
        <Paginations
          current={props.location.query.page}
          pageSize={props.medias.size}
          total={props.medias.total}
          onChange={page => {
            const URI = new URL('http://localhost' + props.location.url);
            URI.searchParams.set('page', page + '');
            window.location.href = URI.pathname + URI.search;
          }}
        />
      </Flex>
      <div className="sidebar">
        <User value={props.me} url={props.location.url} />
        <SideList value={props.hots} title="热门文章" />
        <SideList value={props.latests} title="最新文章" />
        <SideArchive value={props.archives} />
      </div>
    </Flex>
  </Layout>
}

export function Media(props: PropsWithoutRef<IHomePageMedia>) {
  const html = useMemo(() => parse(props.description), [props.description]);
  return <div className={styles.media}>
    <a className={styles.title} href={'/' + props.token}>{props.title}</a>
    <div className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)} dangerouslySetInnerHTML={{ __html: html }} />
    <Flex valign="middle" gap={16} align="between">
      <Flex gap={8} valign="middle">
        <Flex valign="middle" gap={4}>
          <Avatar src={props.user.avatar} size={18} />
          <span className={styles.secondary}>{props.user.nickname}</span>
        </Flex>
        <span className={styles.secondary}>{dayjs(props.gmtc).format('YYYY-MM-DD HH:mm')}发表在 <a href={'/?category=' + props.category.id}>{props.category.name}</a></span>
      </Flex>
      <Flex gap={12}>
        <span className={styles.secondary}>{props.readCount}次阅读</span>
        <span className={styles.secondary}>{props.comments}条评论</span>
      </Flex>
    </Flex>
  </div>
}