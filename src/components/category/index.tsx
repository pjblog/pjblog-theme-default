import styles from './index.module.less';
import classnames from 'classnames';
import { ICategory } from "../../types";
import { PropsWithoutRef, useMemo } from 'react';
import { Typography } from 'antd';
import { useHTML } from '../../html';

export function Categories(props: {
  value: ICategory[],
  current?: number
}) {
  return <ul className={styles.categories}>
    {
      props.value.map(category => {
        return <Category key={category.id} {...category} current={props.current} />
      })
    }
  </ul>
}

function Category(props: PropsWithoutRef<ICategory & {
  current?: number
}>) {
  const html = useHTML();
  const active = useMemo(() => {
    if (!props.outable) return props.id === props.current;
    return props.link === html.url;
  }, [props.outable, props.id, props.current, props.link, html.url])
  return <li>
    <Typography.Link href={props.link} target={props.outable ? '_blank' : undefined} className={classnames({
      [styles.active]: active,
    })}>{props.name}</Typography.Link>
  </li>
}