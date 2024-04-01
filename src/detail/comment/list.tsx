import dayjs from "dayjs"
import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithoutRef, useCallback, useEffect, useMemo, useState } from "react"
import { IComment } from "../../types"
import { Avatar, Button, Col, Divider, Row, Space, Typography, message, Popconfirm } from "antd"
import { Flex } from "../../components/Flex"
import { MdPreview } from 'md-editor-rt';
import { CommentPoster, transformResponse } from "./post"
import axios from "axios"
import { Theme } from "../../components/theme"
import { useMe } from "../../utils";

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
  return <Row gutter={[0, 12]}>
    {comments.map((comment, index) => {
      return <Col span={24} key={comment.id}>
        <Comment
          value={comment}
          token={props.token}
          size={props.size}
          updateCallback={update}
          index={index}
          deleteCallback={delOne}
          updateChildren={props.updateDeletion}
          updateDeletion={updateChildrenDelete}
        />
      </Col>
    })}
  </Row>
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
  return <Flex block gap={12}>
    <Avatar src={props.value.user.avatar} size={48} shape="square" />
    <Flex span={1} direction="vertical">
      <Theme>
        <Space>
          <Typography.Text>{props.value.user.nickname}</Typography.Text>
          <Typography.Text type="secondary">发表于 {dayjs(props.value.gmtc).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
          <Typography.Text type="secondary">编辑于 {dayjs(props.value.gmtm).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
        </Space>
      </Theme>
      {
        updating
          ? <div className={classnames(styles.next, styles.editing)}>
            <CommentPoster
              token={props.token}
              parent={props.value.parent}
              id={props.value.id}
              content={props.value.content}
              extra={<Button type="primary" danger onClick={() => setUpdating(false)}>取消</Button>}
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
      <Theme>
        <div className={classnames(styles.next, styles.info)}>
          <Typography.Text type="secondary">此评论下共有 <strong>{total}</strong> 条子评论</Typography.Text>
          {more && comments.length === 0 && <>
            <Divider type="vertical" />
            <Typography.Link onClick={get}>加载</Typography.Link>
          </>}
          {!open && <>
            <Divider type="vertical" />
            <Typography.Link onClick={() => setOpen(true)}>回复</Typography.Link>
          </>}
          {me.account === props.value.user.account && !updating && <>
            <Divider type="vertical" />
            <Typography.Link onClick={() => setUpdating(true)}>编辑</Typography.Link>
          </>}
          {me.account === props.value.user.account && !updating && <>
            <Divider type="vertical" />
            <DeleteComment
              token={props.token}
              id={props.value.id}
              onDelete={() => {
                props.deleteCallback(props.index);
                if (typeof props.updateChildren === 'function') {
                  props.updateChildren();
                }
              }}
            />
          </>}
        </div>
      </Theme>

      <div className={classnames(styles.next, styles.hide, styles.list)}>
        <Row gutter={[0, 12]}>
          {open && <Col span={24}>
            <CommentPoster
              token={props.token}
              parent={props.value.id}
              id={0}
              extra={<Button type="primary" danger onClick={() => setOpen(false)}>取消</Button>}
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
            />
          </Col>}
          <Col span={24}>
            <CommentList
              value={comments}
              token={props.token}
              size={props.size}
              updateDeletion={() => props.updateDeletion(props.value.id)}
            />
            {!!comments.length && more && <Button type="dashed" block onClick={get}>更多</Button>}
          </Col>
        </Row>
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
    setLoading(true)
    axios.delete('/-/media/' + props.token + '/comment/' + props.id)
      .then(props.onDelete)
      .catch(e => message.error(e.message))
      .finally(() => setLoading(false));
  }, [props.token, props.id, loading, props.onDelete])
  return <Popconfirm
    title="警告"
    description="删除行为将删除这条评论以及此评论下的所有回复，确定要删除此评论？"
    onConfirm={submit}
    okText="删除"
    cancelText="取消"
  >
    <Typography.Link disabled={loading}>删除</Typography.Link>
  </Popconfirm>

}