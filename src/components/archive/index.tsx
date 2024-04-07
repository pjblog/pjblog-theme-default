import styles from './index.module.less';
import { PropsWithoutRef } from "react";
import { IArchive } from "../../types";
import { Side } from "../side";

export function SideArchive(props: PropsWithoutRef<{
  value: IArchive[],
}>) {
  return <Side title="归档">
    <ul className={styles.list}>
      {
        props.value.map(({ year, month, count }, index) => {
          return <li key={index}>
            <a
              href={`/archive/${year}/${month}`}
            >{year}年{month}月({count})</a>
          </li>
        })
      }
    </ul>
  </Side>
}