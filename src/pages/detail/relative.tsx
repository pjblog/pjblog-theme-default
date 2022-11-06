import React from 'react';
import dayjs from 'dayjs';
import { useArticleLocation, useRelativeArticles } from '../../components';
import { Typography, Card } from 'antd';
import { Flex } from '../../lib';

export function Relative(props: React.PropsWithoutRef<{ id: number, size: number }>) {
  const { data } = useRelativeArticles(props.id, props.size);
  const { redirect } = useArticleLocation();
  return <Card title="相关日志" size="small">
    <ul>
      {
        data.map((value, index) => {
          return <li key={value.id}>
            <Flex align="between" valign="middle">
              <span>{index + 1}. <Typography.Link onClick={() => redirect(value.code)}>{value.title}</Typography.Link></span>
              <span>{dayjs(value.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Flex>
          </li>
        })
      }
    </ul>
  </Card>
}