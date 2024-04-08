import styles from './index.module.less';
import dayjs from 'dayjs';
import { PropsWithChildren, PropsWithoutRef } from "react";
import { IArticle, IMedia } from "../types";
import { Flex } from '../components/Flex';
import { Avatar } from '../components/avatar';
import { Link } from '../components/link';

export function ArticleInfo(props: PropsWithoutRef<{
  media: IMedia,
  article: IArticle
}>) {
  return <ul className={styles.articleInfo}>
    <li>
      <Info title='作者'>
        <Flex valign="middle" gap={4}>
          <Avatar src={props.media.user.avatar} size={18} />
          <span>{props.media.user.nickname}</span>
        </Flex>
      </Info>
    </li>
    <li>
      <Info title='浏览量'>{props.media.readCount}次</Info>
    </li>
    <li>
      <Info title='分类'>
        <Link href={'/?category=' + props.media.category.id}>
          {props.media.category.name}
        </Link>
      </Info>
    </li>
    <li>
      <Info title='标签'>
        <Flex valign="middle" gap={8}>
          {props.article.tags.map(tag => <Link key={tag.id}>{tag.name}</Link>)}
        </Flex>
      </Info>
    </li>
    <li>
      <Info title='发表时间'>{dayjs(props.media.gmtc).format('YYYY-MM-DD HH:mm:ss')}</Info>
    </li>
    <li>
      <Info title='更新时间'>{dayjs(props.media.gmtm).format('YYYY-MM-DD HH:mm:ss')}</Info>
    </li>
  </ul>
}

function Info(props: PropsWithChildren<{ title: string }>) {
  return <Flex block valign="middle" gap={8} className={styles.dinfo}>
    <span className={styles.info}>{props.title}</span>
    <div className={styles.item}>{props.children}</div>
  </Flex>
}