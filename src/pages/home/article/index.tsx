import React from 'react';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { IAricle, useArticlesLocation } from '../../../components';
import { Typography, Tag, Divider, Space, Avatar } from 'antd';
import { redirect } from '@codixjs/codix';

export function Article(props: React.PropsWithoutRef<IAricle>) {
  const home = useArticlesLocation();
  return <div className={styles.article}>
    <Typography.Title level={3}>
      <Typography.Link onClick={() => redirect('/article/' + props.code)}>{props.title}</Typography.Link>
    </Typography.Title>
    <Typography.Paragraph>
      <Space>
        <Avatar src={props.user.avatar} size={16} />
        {props.user.nickname}
      </Space>
      <Divider type="vertical" />
      分类：
      <Typography.Link onClick={() => home.redirect({ category: props.category.id })}>{props.category.name}</Typography.Link>
      <Divider type="vertical" />
      发表于：{dayjs(props.ctime).format('YYYY-MM-DD HH:mm')}
      <Divider type="vertical" />
      阅读量：{props.readCount}
      <Divider type="vertical" />
      评论：{props.comments}
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