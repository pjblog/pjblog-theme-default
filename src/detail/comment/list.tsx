import dayjs from "dayjs"
import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithoutRef, useCallback, useEffect, useMemo, useState } from "react"
import { IComment } from "../../types"
import { Flex } from "../../components/Flex"
import { MdPreview } from 'md-editor-rt';
import { CommentPoster, transformResponse } from "./post"
import axios from "axios"
import { useMe } from "../../utils";
import { Avatar } from "../../components/avatar";
import { Link } from "../../components/link";
import toast from 'react-hot-toast';
const message = toast

type IUpdate = (index: number, value: string) => void;
type IDelete = (index: number) => void;
type IUpdateChildrenDelete = (id: number) => void;

export function CommentList(props: PropsWithoutRef<{
  value: IComment[],
  token: string,
  size: number,
  updateDeletion?: () => void,
}>) {
  const [comments, setComments] = useState(props.value);
  const update: IUpdate = useCallback((index: number, value: string) => {
    const left = comments.slice(0, index);
    const right = comments.slice(index + 1);
    const current = comments[index];
    const _current: IComment = {
      ...current,
      content: value,
    }
    setComments([
      ...left,
      _current,
      ...right,
    ])
  }, [comments]);
  const delOne: IDelete = useCallback((index: number) => {
    const tmp = comments.slice(0);
    const left = tmp.slice(0, index);
    const right = tmp.slice(index + 1);
    setComments([
      ...left,
      ...right,
    ])
  }, [comments]);
  const updateChildrenDelete: IUpdateChildrenDelete = useCallback((id: number) => {
    const tmp = comments.slice(0);
    const index = tmp.findIndex(comment => comment.id === id);
    if (index > -1) {
      const left = tmp.slice(0, index);
      const right = tmp.slice(index + 1);
      const current = tmp[index];
      const _current: IComment = {
        ...current,
        children: current.children - 1,
      }
      setComments([
        ...left,
        _current,
        ...right,
      ])
    }
  }, [comments]);
  useEffect(() => setComments(props.value), [props.value]);
  return <Flex direction="vertical" gap={[0, 12]}>
    {comments.map((comment, index) => {
      return <Comment
        key={comment.id}
        value={comment}
        token={props.token}
        size={props.size}
        updateCallback={update}
        index={index}
        deleteCallback={delOne}
        updateChildren={props.updateDeletion}
        updateDeletion={updateChildrenDelete}
      />
    })}
  </Flex>
}

function Comment(props: PropsWithoutRef<{
  value: IComment,
  token: string,
  size: number,
  updateCallback: IUpdate,
  deleteCallback: IDelete,
  index: number,
  updateChildren?: () => void,
  updateDeletion: IUpdateChildrenDelete
}>) {
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(props.value.children);
  const [comments, setComments] = useState([]);
  const more = useMemo(() => comments.length < total, [comments, total]);
  const get = useCallback(() => {
    axios.get('/-/media/' + props.token + '/comment?page=' + page + '&parent=' + props.value.id)
      .then(res => transformResponse(res.data, (__comments) => {
        if (comments.length + __comments.length < total) {
          setPage(page + 1);
        }
        setComments([
          ...comments,
          ...__comments,
        ])
      }))
      .catch(e => message.error(e.message));
  }, [props.token, page, props.value.id, comments, total])

  useEffect(() => setTotal(props.value.children), [props.value.children]);
  return <Flex block gap={12} className={styles.comment}>
    <Avatar src={props.value.user.avatar} size={48} shape="square" />
    <Flex span={1} direction="vertical">
      <Flex gap={8} className={styles.uinfo}>
        <span className={styles.nickname}>{props.value.user.nickname}</span>
        <span className={styles.time}>发表于 {dayjs(props.value.gmtc).format('YYYY-MM-DD HH:mm:ss')}</span>
        <span className={styles.time}>编辑于 {dayjs(props.value.gmtm).format('YYYY-MM-DD HH:mm:ss')}</span>
      </Flex>
      {
        updating
          ? <div className={classnames(styles.next, styles.editing)}>
            <CommentPoster
              token={props.token}
              parent={props.value.parent}
              id={props.value.id}
              content={props.value.content}
              extra={<button className={styles.btn} onClick={() => setUpdating(false)}>取消</button>}
              onUpdate={(type, comment: string) => {
                setUpdating(false);
                if (type === 'update') {
                  props.updateCallback(props.index, comment);
                }
              }}
            />
          </div>
          : <div className={classnames(styles.next, styles.preview)}>
            <MdPreview editorId={'md-preview-' + props.value.id} modelValue={props.value.content} />
          </div>
      }
      <div className={classnames(styles.next, styles.info)}>
        <span>此评论下共有 <strong>{total}</strong> 条子评论</span>
        {more && comments.length === 0 && <Link onClick={get}>加载</Link>}
        {!open && <Link onClick={() => setOpen(true)}>回复</Link>}
        {me.account === props.value.user.account && !updating && <Link onClick={() => setUpdating(true)}>编辑</Link>}
        {me.account === props.value.user.account && !updating && <DeleteComment
          token={props.token}
          id={props.value.id}
          onDelete={() => {
            props.deleteCallback(props.index);
            if (typeof props.updateChildren === 'function') {
              props.updateChildren();
            }
          }}
        />}
      </div>

      <div className={classnames(styles.next, styles.hide, styles.list)}>
        {open && <CommentPoster
          token={props.token}
          parent={props.value.id}
          id={0}
          extra={<button className={styles.btn} onClick={() => setOpen(false)}>取消</button>}
          onUpdate={(type, comment) => {
            setOpen(false);
            if (type === 'add') {
              let _comments = [
                comment,
                ...comments
              ];
              if (_comments.length > page * props.size) {
                _comments = _comments.slice(0, page * props.size);
              }
              setComments(_comments)
              setTotal(total + 1);
            }
          }}
        />}
        <CommentList
          value={comments}
          token={props.token}
          size={props.size}
          updateDeletion={() => props.updateDeletion(props.value.id)}
        />
        {!!comments.length && more && <button className={styles.more} onClick={get}>更多</button>}
      </div>
    </Flex>
  </Flex>
}

function DeleteComment(props: PropsWithoutRef<{
  token: string,
  id: number,
  onDelete: () => void
}>) {
  const [loading, setLoading] = useState(false);
  const submit = useCallback(() => {
    if (loading) return;
    if (window.confirm('删除行为将删除这条评论以及此评论下的所有回复，确定要删除此评论？')) {
      setLoading(true)
      axios.delete('/-/media/' + props.token + '/comment/' + props.id)
        .then(props.onDelete)
        .catch(e => message.error(e.message))
        .finally(() => setLoading(false));
    }
  }, [props.token, props.id, loading, props.onDelete])
  return <Link onClick={submit}>删除</Link>
}