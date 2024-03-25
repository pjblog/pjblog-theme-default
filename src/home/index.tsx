import styles from './index.module.less';
import { PropsWithoutRef } from 'react';

export default function (props: PropsWithoutRef<{
  state: any,
}>) {
  return <div className={styles.container} onClick={() => alert(1)}>home {JSON.stringify(props.state)}</div>
}