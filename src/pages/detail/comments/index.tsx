import dayjs from 'dayjs';
import styles from './index.module.less';
import { Avatar, Col, Row, Space, Divider, Typography, Button } from 'antd';
import React, { Fragment, useState } from 'react';
import { IComment, useComments } from '../../../components';
import { Flex } from '../../../lib';
import { PostCommandBox } from '../post-box';

export function Comments(props: React.PropsWithoutRef<{ id: number }>) {
  const { data: { list, total }, setData, setIndex } = useComments(props.id);
  const resolve = (state: IComment, rid: number) => {
    if (rid === 0) {
      setData({
        list: [
          state,
          ...list.slice(0),
        ],
        total: total + 1,
      })
    } else {
      const _list = list.slice(0);
      const index = _list.findIndex(c => c.id === rid);
      if (index > -1) {
        const current = _list[index];
        const prev = _list.slice(0, index);
        const next = _list.slice(index + 1);
        current.replies = current.replies || [];
        current.replies.push(state);
        setData({
          list: [
            ...prev,
            current,
            ...next
          ],
          total,
        })
      }
    }
    setTimeout(() => {
      const el = document.getElementById('comm_' + state.id);
      console.log('el', !!el)
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }, 300);
  }
  return <Row gutter={[0, 48]}>
    {
      list.map(chunk => {
        return <Item {...chunk} aid={props.id} key={chunk.id} setState={resolve} />
      })
    }
    {list.length !== total && <Col span={24}>
      <Button onClick={() => setIndex(list.length)}>加载更多</Button>
    </Col>}
    <Col span={24}>
      <PostCommandBox id={props.id} cid={0} onComplete={(data) => resolve(data, 0)} />
    </Col>
  </Row>
}

function Item(props: React.PropsWithoutRef<IComment & { aid: number, setState: (state: IComment, rid: number) => void }>) {
  const [open, setOpen] = useState(false);
  return <Col span={24} id={'comm_' + props.id}>
    <Space direction="vertical">
      <Flex gap={8}>
        <Avatar src={props.user.avatar} size="large" shape="square" />
        <div>
          <div>{props.user.nickname}</div>
          <div>
            <span>发表于：{dayjs(props.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
            <Divider type="vertical" />
            <span>来自：{props.ip}</span>
          </div>
        </div>
      </Flex>
      <div className={styles.html} dangerouslySetInnerHTML={{ __html: props.html }}></div>
      {
        !!props?.replies?.length && <div className={styles.reply}>
          <Row gutter={[0, 24]}>
            {
              props.replies.map(reply => {
                return <Item {...reply} aid={props.aid} key={reply.id} setState={props.setState} />
              })
            }
          </Row>
        </div>
      }
      {
        !props.rid && <Fragment>
          <Typography.Link onClick={() => setOpen(!open)}>回复</Typography.Link>
          {open && <PostCommandBox id={props.aid} cid={props.id} onComplete={(data) => {
            setOpen(false);
            props.setState(data, props.id);
          }} />}
        </Fragment>
      }
    </Space>
  </Col>
}