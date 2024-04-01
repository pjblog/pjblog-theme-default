import styles from './index.module.less';
import classnames from 'classnames';
import { parse } from 'marked';
import { PropsWithoutRef, useMemo, useState } from "react";
import { IArticle, IComment, IMedia } from "../types";
import { Typography, Divider, Row, Col, Pagination } from "antd";
import { CommentPoster } from './comment/post';
import { CommentList } from './comment/list';
import { useMe } from '../utils';

export function Article(props: PropsWithoutRef<{
  media: IMedia,
  article: IArticle,
  token: string,
  page: number,
  url: string,
}>) {
  const me = useMe();
  const [total, setTotal] = useState(props.article.comments.total);
  const [comments, setComments] = useState<IComment[]>(props.article.comments.data);
  const content = useMemo(() => parse(props.article.markdown), [props.article.markdown]);
  const showComment = useMemo(() => comments.length && props.article.comments.commentable && !!me.account, [
    comments, props.article.comments.commentable, me.account
  ])
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
    <Row gutter={[0, 48]}>
      {props.article.comments.commentable && <Col span={24}>
        <Typography.Title level={4}>发表评论</Typography.Title>
        <CommentPoster clearable token={props.token} parent={0} id={0} onUpdate={(type, comment: IComment) => {
          if (type === 'add') {
            let _comments = [
              comment,
              ...comments
            ];
            if (_comments.length > props.article.comments.rootSize) {
              _comments = _comments.slice(0, props.article.comments.rootSize)
            }
            setComments([
              comment,
              ...comments
            ])
            setTotal(total + 1);
          }
        }} />
      </Col>}
      {showComment && <Col span={24} id="commnets">
        <Typography.Title level={4}>评论列表({total})</Typography.Title>
        <CommentList value={comments} token={props.token} size={props.article.comments.rootSize} />
      </Col>}
      {showComment && <Col span={24}>
        <Pagination
          current={props.page}
          pageSize={props.article.comments.rootSize}
          total={props.article.comments.total}
          onChange={p => {
            const URI = new URL('http://localhost' + props.url);
            URI.searchParams.set('page', p + '');
            window.location.href = URI.pathname + URI.search + '#comments';
          }}
        />
      </Col>}
    </Row>
  </>
}

