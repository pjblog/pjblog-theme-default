import styles from './index.module.less';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { createArticlesQuery, useArticles } from "@pjblog/hooks"
import { numberic } from "../../utils";
import { useRequestQuery } from '@codixjs/codix';
import { Typography, Tag } from 'antd';
import { ClockCircleOutlined, PieChartOutlined, EyeOutlined } from '@ant-design/icons';

import type { IAricleWithSummary } from '@pjblog/hooks';
import { PropsWithoutRef, useCallback } from 'react';
import { Flex } from '../../components';
import { Pagination, Breadcrumb } from 'antd';
import { useConfigs } from '@pjblog/hooks';
import { usePath } from '../../hooks';

export default function HomePage() {
  const configs = useConfigs();
  const HOME = usePath('HOME');
  const _keyword = useRequestQuery<string>('keyword');
  const _category = useRequestQuery('category', numberic(0)) as number;
  const _tag = useRequestQuery('tag', numberic(0)) as number;
  const _page = useRequestQuery('page', numberic(1)) as number;
  const { data } = useArticles({
    keyword: _keyword,
    category: _category,
    tag: _tag,
    page: _page
  });
  const go = useCallback((page: number) => {
    const qs = createArticlesQuery({
      category: _category,
      tag: _tag,
      keyword: _keyword,
      page,
    })
    HOME.redirect({}, qs);
  }, [_category, _tag, _keyword]);
  return <div className={styles.articles}>
    {(!!data.category || !!data.tag) && <div className={styles.meta}>
      <Breadcrumb>
        <Breadcrumb.Item>{
          !!data.category
            ? '分类'
            : !!data.tag
              ? '标签'
              : null
        }</Breadcrumb.Item>
        <Breadcrumb.Item>{data.category || data.tag}</Breadcrumb.Item>
      </Breadcrumb>
    </div>}
    {
      data.dataSource.map(article => {
        return <Article {...article} key={article.id} />
      })
    }
    <div className={styles.page}>
      <Pagination 
        current={_page} 
        pageSize={configs.article_size} 
        total={data.total} 
        onChange={go}
      />
    </div>
  </div>
}

function Article(props: PropsWithoutRef<IAricleWithSummary>) {
  const PATH = usePath('HOME');
  const ARTICLE = usePath('ARTICLE');
  const _qs = createArticlesQuery({ category: props.category.id });
  return <div className={styles.article}>
    <Typography.Title level={2} onClick={() => ARTICLE.redirect({ code: props.code })}>{props.title}</Typography.Title>
    <div dangerouslySetInnerHTML={{ __html: props.summary }} className={classnames('markdown', styles.content)}></div>
    <Flex className={styles.extras} align="between" valign="middle">
      <Flex gap={24} valign="middle">
        <Flex gap={6} valign="middle">
          <ClockCircleOutlined />
          <span>{dayjs(props.ctime).format('YYYY-MM-DD')}</span>
        </Flex>
        <Flex gap={6} valign="middle">
          <PieChartOutlined />
          <Typography.Link onClick={() => PATH.redirect({}, _qs)}>{props.category.name}</Typography.Link>
        </Flex>
        <Flex gap={6} valign="middle">
          <EyeOutlined />
          <span>{props.readCount}</span>
        </Flex>
      </Flex>
      <div>
        {
          props.tags.map(tag => {
            const qs = createArticlesQuery({ tag: tag.id });
            return <Tag className={styles.tag} key={tag.id} onClick={() => PATH.redirect({}, qs)}>{tag.name}</Tag>
          })
        }
      </div>
    </Flex>
  </div>
}