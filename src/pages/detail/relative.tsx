import React from 'react';
import dayjs from 'dayjs';
import { useRelativeArticles } from '../../components';
import { Typography, Card } from 'antd';
import { Flex } from '../../lib';
import { redirect } from '@codixjs/codix';

export function Relative(props: React.PropsWithoutRef<{ id: number, size: number }>) {
  const { data } = useRelativeArticles(props.id, props.size);
  return <Card title="相关日志" size="small">
    <ul>
      {
        data.map((value, index) => {
          return <li key={value.id}>
            <Flex align="between" valign="middle">
              <span>{index + 1}. <Typography.Link onClick={() => redirect('/article/' + value.code)}>{value.title}</Typography.Link></span>
              <span>{dayjs(value.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Flex>
          </li>
        })
      }
    </ul>
  </Card>
}