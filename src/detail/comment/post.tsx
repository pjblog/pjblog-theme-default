import axios from 'axios';
import styles from './index.module.less';
import { PropsWithoutRef, ReactNode, useCallback, useState } from "react";
import { MdEditor, ToolbarNames } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { IComment } from '../../types';
import { Flex } from '../../components/Flex';
import toast from 'react-hot-toast';
const message = toast

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
    if (!content?.length) return message.error('请输入评论内容');
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

  return <Flex direction="vertical" gap={[0, 8]} style={{ marginBottom: 24 }}>
    <MdEditor
      pageFullscreen={false}
      preview={false}
      modelValue={content}
      onChange={setContent}
      editorId={'md-editor-' + props.id + '-' + props.parent}
      toolbars={toolbars}
      placeholder='请输入评论内容（注意：不要涉及反动言论以及敏感词句）'
    />
    <Flex valign="middle" gap={8}>
      <button className={styles.btn} disabled={loading} onClick={submit}>发表</button>
      {props.extra}
    </Flex>
  </Flex>
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