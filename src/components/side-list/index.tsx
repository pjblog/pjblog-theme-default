import styles from './index.module.less';
import { PropsWithoutRef } from "react";
import { ISideMedia } from "../../types";
import { Side } from "../side";
import { Typography } from "antd";

export function SideList(props: PropsWithoutRef<{
  value: ISideMedia[],
  title: string,
}>) {
  return <Side title={props.title}>
    <ul className={styles.list}>
      {
        props.value.map(item => {
          return <li key={item.token}>
            <Typography.Link type="secondary" ellipsis href={'/' + item.token}>{item.title}</Typography.Link>
          </li>
        })
      }
    </ul>
  </Side>
}