import React, { useCallback } from 'react';
import styles from 'index.module.less';
import { Card, Typography } from 'antd';
import { redirect } from '@codixjs/codix';
import { ICategory, useArticlesLocation, useCategories } from '../../components';

export function CategoryPannel() {
  const { data } = useCategories();
  return <Card title="分类导航" size="small">
    <ul>
      {
        data.map(value => <Item {...value} key={value.id} />)
      }
    </ul>
  </Card>
}

function Item(props: React.PropsWithoutRef<ICategory>) {
  const artLoc = useArticlesLocation();
  const isWebUrl = props.outable && props.outlink && !props.outlink.startsWith('/');
  const click = useCallback(() => {
    if (!props.outable) return artLoc.redirect({ category: props.id });
    if (props.outlink && props.outlink.startsWith('/')) {
      return redirect(props.outlink);
    }
  }, [])
  return <li>
    <Typography.Link href={isWebUrl ? props.outlink : undefined} target={isWebUrl ? '_blank' : undefined} onClick={isWebUrl ? undefined : click}>{props.name}{count(props)}</Typography.Link>
  </li>
}

function count(props: ICategory) {
  return props.outable
    ? null
    : '(' + props.count + ')'
}