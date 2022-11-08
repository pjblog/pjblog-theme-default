import React from 'react';
import styles from 'index.module.less';
import { Card, Typography } from 'antd';
import { ILink, useLinks } from '../../components';
import { PlusOutlined } from '@ant-design/icons';
import { redirect } from '@codixjs/codix';

export function LinkPannel() {
  const { data } = useLinks(5);
  return <Card title="友情链接" size="small">
    <ul>
      {
        data.map(value => <Item {...value} key={value.id} />)
      }
      <li>
        <Typography.Link onClick={() => redirect('/link')}><PlusOutlined /> 申请链接...</Typography.Link>
      </li>
    </ul>
  </Card>
}

function Item(props: React.PropsWithoutRef<ILink>) {
  return <li>
    <Typography.Link href={props.url} target="_blank">{props.name}</Typography.Link>
  </li>
}