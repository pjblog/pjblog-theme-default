import styles from './index.module.less';
import 'antd/es/style/reset.css';
import { PropsWithChildren } from 'react';
import { Typography } from 'antd';
import { Theme } from '../components/theme';
import { Categories } from '../components/category';
import { ICategory } from '../types';
export function Layout(props: PropsWithChildren<{
  title: string,
  description: string,
  categories: ICategory[],
  currentCategory?: number,
}>) {
  return <div className={styles.layout}>
    <div className={styles.header}>
      <Typography.Title level={1} className={styles.title}>{props.title}</Typography.Title>
      <Theme>
        <Typography.Text>{props.description}</Typography.Text>
      </Theme>
    </div>
    <div className={styles.category}>
      <Categories value={props.categories} current={props.currentCategory} />
    </div>
    <div className={styles.body}>{props.children}</div>
  </div>
}