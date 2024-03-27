import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithChildren, ReactNode } from "react";

export function Side(props: PropsWithChildren<{
  title: ReactNode,
  padable?: boolean,
}>) {
  return <aside className={styles.side}>
    <div className={styles.title}>{props.title}</div>
    <div className={classnames(styles.body, {
      [styles.nopad]: !props.padable
    })}>{props.children}</div>
  </aside>
}