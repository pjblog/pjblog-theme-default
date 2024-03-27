import styles from './index.module.less';
import classnames from 'classnames';
import { ICategory } from "../../types";
import { PropsWithoutRef, useMemo } from 'react';
import { Typography } from 'antd';

export function Categories(props: {
  value: ICategory[],
  current?: number,
  url: string,
}) {
  return <ul className={styles.categories}>
    {
      props.value.map(category => {
        return <Category key={category.id} {...category} current={props.current} url={props.url} />
      })
    }
  </ul>
}

function Category(props: PropsWithoutRef<ICategory & {
  current?: number,
  url: string
}>) {
  const active = useMemo(() => {
    if (!props.outable) return props.id === props.current;
    return props.link === props.url;
  }, [props.outable, props.id, props.current, props.link, props.url])
  return <li>
    <Typography.Link href={props.link} className={classnames({
      [styles.active]: active,
    })}>{props.name}</Typography.Link>
  </li>
}