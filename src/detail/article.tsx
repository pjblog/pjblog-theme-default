import styles from './index.module.less';
import 'rc-pagination/assets/index.less';
import classnames from 'classnames';
import Pagination from 'rc-pagination';
import { parse } from 'marked';
import { PropsWithChildren, PropsWithoutRef, useMemo, useState } from "react";
import { IArticle, IComment, IMedia } from "../types";
import { CommentPoster } from './comment/post';
import { CommentList } from './comment/list';
import { useMe } from '../utils';
import { Link } from '../components/link';

// @ts-ignore
const Paginations = (Pagination?.default || Pagination) as typeof Pagination;

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
    <h2 style={{ marginBottom: 24 }}>{props.media.title}</h2>
    <div
      className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)}
      dangerouslySetInnerHTML={{ __html: content }} />
    {!!props.article.source.length && <fieldset>
      <legend>参考链接</legend>
      <ol>
        {props.article.source.map(source => {
          return <li key={source}>
            <Link href={source} target="_blank">{source}</Link>
          </li>
        })}
      </ol>
    </fieldset>}
    {props.article.comments.commentable && <Channel>
      <h3>发表评论</h3>
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
    </Channel>}

    {showComment && <Channel>
      <h3>评论列表({total})</h3>
      <CommentList value={comments} token={props.token} size={props.article.comments.rootSize} />
    </Channel>}

    {showComment && <Channel>
      <Paginations
        current={props.page}
        pageSize={props.article.comments.rootSize}
        total={props.article.comments.total}
        onChange={p => {
          const URI = new URL('http://localhost' + props.url);
          URI.searchParams.set('page', p + '');
          window.location.href = URI.pathname + URI.search + '#comments';
        }}
      />
    </Channel>}
  </>
}

function Channel(props: PropsWithChildren) {
  return <div className="channel">{props.children}</div>
}