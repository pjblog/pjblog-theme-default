import dayjs from "dayjs"
import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithoutRef, useCallback, useMemo, useState } from "react"
import { IComment } from "../../types"
import { Avatar, Button, Col, Divider, Row, Space, Typography, message } from "antd"
import { Flex } from "../../components/Flex"
import { MdPreview } from 'md-editor-rt';
import { CommentPoster, transformResponse } from "./post"
import axios from "axios"
import { Theme } from "../../components/theme"

export function CommentList(props: PropsWithoutRef<{
  value: IComment[],
  token: string,
  size: number,
}>) {
  return <Row gutter={[0, 12]}>
    {props.value.map(comment => {
      return <Col span={24} key={comment.id}>
        <Comment value={comment} token={props.token} size={props.size} />
      </Col>
    })}
  </Row>
}

function Comment(props: PropsWithoutRef<{
  value: IComment,
  token: string,
  size: number,
}>) {
  const [open, setOpen] = useState(false);
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
      <div className={classnames(styles.next, styles.preview)}>
        <MdPreview editorId={'md-preview-' + props.value.id} modelValue={props.value.content} />
      </div>
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
            <CommentList value={comments} token={props.token} size={props.size} />
            {!!comments.length && more && <Button type="dashed" block onClick={get}>更多</Button>}
          </Col>
        </Row>
      </div>
    </Flex>
  </Flex>
}