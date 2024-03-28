import styles from './index.module.less';
import dayjs from 'dayjs';
import { PropsWithChildren, PropsWithoutRef } from "react";
import { IArticle, IMedia } from "../types";
import { Tag, Typography, Space, Avatar } from "antd";
import { Theme } from '../components/theme';

export function ArticleInfo(props: PropsWithoutRef<{
  media: IMedia,
  article: IArticle
}>) {
  return <ul className={styles.articleInfo}>
    <li>
      <Info title='作者'>
        <Space>
          <Avatar src={props.media.user.avatar} size={18} />
          <Typography.Text type="secondary">{props.media.user.nickname}</Typography.Text>
        </Space>
      </Info>
    </li>
    <li>
      <Info title='浏览量'>
        <Typography.Text type="secondary">{props.media.readCount}次</Typography.Text>
      </Info>
    </li>
    <li>
      <Info title='分类'>
        <Typography.Link href={'/?category=' + props.media.category.id}>
          {props.media.category.name}
        </Typography.Link>
      </Info>
    </li>
    <li>
      <Info title='标签'>
        <Space>
          {
            props.article.tags.map(tag => {
              return <Typography.Link key={tag.id}>
                {tag.name}
              </Typography.Link>
            })
          }
        </Space>
      </Info>
    </li>
    {/* <li>
      <Info title='MD5'>
        <Tag>{props.article.md5}</Tag>
      </Info>
    </li> */}
    <li>
      <Info title='发表时间'>
        <Typography.Text type="secondary">
          {dayjs(props.media.gmtc).format('YYYY-MM-DD HH:mm:ss')}
        </Typography.Text>
      </Info>
    </li>
    <li>
      <Info title='更新时间'>
        <Typography.Text type="secondary">
          {dayjs(props.media.gmtm).format('YYYY-MM-DD HH:mm:ss')}
        </Typography.Text>
      </Info>
    </li>
  </ul>
}

function Info(props: PropsWithChildren<{ title: string }>) {
  return <>
    <Typography.Text className={styles.info}>{props.title}</Typography.Text>
    <Theme>{props.children}</Theme>
  </>
}