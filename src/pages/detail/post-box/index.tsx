import React, { useCallback } from 'react';
import { IComment, useCommentPost } from '../../../components';
import { Button, Card, Input, message, Space } from 'antd';
import e from 'express';

export function PostCommandBox(props: React.PropsWithoutRef<{ id: number, cid: number, onComplete: (data: IComment) => void }>) {
  const { text, setText, loading, submit } = useCommentPost(props.id, props.cid);
  const _submit = useCallback(() => {
    submit()
      .then(props.onComplete)
      .then(() => setText(null))
      .then(() => message.success('发表成功'))
      .catch(e => message.error(e.message));
  }, [submit])
  return <Card title="发表评论" size="small">
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea disabled={loading} rows={5} value={text} onChange={e => setText(e.target.value)} placeholder="评论内容" />
      <Button type="primary" onClick={_submit} loading={loading}>发表</Button>
    </Space>
  </Card>
}