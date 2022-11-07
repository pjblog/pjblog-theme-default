import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { IAricle, useArticleLocation, useArticlesLocation } from '../../../components';
import { Typography, Tag, Divider } from 'antd';

export function Article(props: React.PropsWithoutRef<IAricle>) {
  const home = useArticlesLocation();
  const article = useArticleLocation();
  return <div className={styles.article}>
    <Typography.Title level={3}>
      <Typography.Link onClick={() => article.redirect(props.code)}>{props.title}</Typography.Link>
    </Typography.Title>
    <Typography.Paragraph>
      分类：
      <Typography.Link onClick={() => home.redirect({ category: props.category.id })}>{props.category.name}</Typography.Link>
      <Divider type="vertical" />
      发表于：{dayjs(props.ctime).format('YYYY-MM-DD HH:mm')}
      <Divider type="vertical" />
      阅读量：{props.readCount}
    </Typography.Paragraph>
    <Typography.Paragraph>{props.summary}</Typography.Paragraph>
    {
      !!props.tags.length && <Typography.Paragraph>
        {props.tags.map(tag => {
          return <Tag key={tag.id} onClick={() => home.redirect({ tag: tag.id })}>{tag.name}</Tag>
        })}
      </Typography.Paragraph>
    }
  </div>
}