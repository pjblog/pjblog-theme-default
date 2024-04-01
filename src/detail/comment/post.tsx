import axios from 'axios';
import { PropsWithoutRef, ReactNode, useCallback, useState } from "react";
import { MdEditor, ToolbarNames } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { Button, Col, Row, Space, message } from "antd";
import { IComment } from '../../types';

const toolbars: ToolbarNames[] = [
  'preview',
  '-',
  'revoke',
  'next',
  '-',
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task', // ^2.4.0
  '-',
  'codeRow',
  'code',
  'link',
  'table',
]

export function CommentPoster(props: PropsWithoutRef<{
  token: string,
  parent: number,
  id: number,
  content?: string,
  onUpdate: (type: 'add' | 'update', data: IComment | string) => void,
  extra?: ReactNode,
  clearable?: boolean
}>) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(props.content);

  const submit = useCallback(() => {
    if (!content?.length) return message.warning('请输入评论内容');
    setLoading(true);
    if (props.id > 0) {
      updateComment(props.token, props.id, content)
        .then((res) => transformResponse<IComment>(
          res.data,
          () => {
            props.onUpdate('update', content);
            if (props.clearable) {
              setContent('');
            }
            return message.success('更新评论成功');
          },
        ))
        .catch(e => message.error(e.message))
        .finally(() => setLoading(false));
    } else {
      addComment(props.token, content, props.parent)
        .then((res) => transformResponse<IComment>(
          res.data,
          comment => {
            props.onUpdate('add', comment);
            if (props.clearable) {
              setContent('');
            }
            return message.success('添加评论成功');
          },
        ))
        .catch(e => message.error(e.message))
        .finally(() => setLoading(false));
    }
  }, [props.id, props.token, content, props.parent, setLoading, setContent, props.clearable]);

  return <Row gutter={[0, 12]}>
    <Col span={24}>
      <MdEditor
        pageFullscreen={false}
        preview={false}
        modelValue={content}
        onChange={setContent}
        editorId={'md-editor-' + props.id + '-' + props.parent}
        toolbars={toolbars}
        placeholder='请输入评论内容（注意：不要涉及反动言论以及敏感词句）'
      />
    </Col>
    <Col span={24}>
      <Space>
        <Button type="primary" onClick={submit} loading={loading}>发表</Button>
        {props.extra}
      </Space>
    </Col>
  </Row>
}

function addComment(token: string, content: string, parent: number) {
  return axios.put('/-/media/' + token + '/comment', {
    content, parent,
  })
}
function updateComment(token: string, id: number, content: string) {
  return axios.post('/-/media/' + token + '/comment/' + id, {
    content,
  })
}

export function transformResponse<T = any>(
  res: { status: number, data?: T, message?: string },
  callback: (v: T) => any
) {
  if (res.status !== 200) return message.error(res.message);
  return callback(res.data);
}