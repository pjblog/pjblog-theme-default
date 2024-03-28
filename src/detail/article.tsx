import styles from './index.module.less';
import classnames from 'classnames';
import { parse } from 'marked';
import { PropsWithoutRef, useMemo } from "react";
import { IArticle, IMedia } from "../types";
import { Typography, Divider } from "antd";

export function Article(props: PropsWithoutRef<{
  media: IMedia,
  article: IArticle
}>) {
  const content = useMemo(() => parse(props.article.markdown), [props.article.markdown]);
  return <>
    <Typography.Title level={2} style={{ marginBottom: 48 }}>{props.media.title}</Typography.Title>
    <div
      className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)}
      dangerouslySetInnerHTML={{ __html: content }} />
    {!!props.article.source.length && <>
      <Divider orientation="left" plain>参考链接</Divider>
      <ol>
        {props.article.source.map(source => {
          return <li key={source}>
            <Typography.Link href={source} target="_blank">{source}</Typography.Link>
          </li>
        })}
      </ol>
    </>}
  </>
}