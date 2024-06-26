import styles from './index.module.less';
import { PropsWithoutRef } from "react";
import { ISideMedia } from "../../types";
import { Side } from "../side";
import { Typography } from "antd";
import { Link } from '../link';

export function SideList(props: PropsWithoutRef<{
  value: ISideMedia[],
  title: string,
}>) {
  return <Side title={props.title}>
    <ul className={styles.list}>
      {
        props.value.map(item => {
          return <li key={item.token}>
            <Link type="secondary" href={'/' + item.token}>{item.title}</Link>
          </li>
        })
      }
    </ul>
  </Side>
}