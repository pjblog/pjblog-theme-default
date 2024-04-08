import styles from './index.module.less';
import { PropsWithoutRef } from "react";
import { IArchive } from "../../types";
import { Side } from "../side";
import { Link } from '../link';

export function SideArchive(props: PropsWithoutRef<{
  value: IArchive[],
}>) {
  return <Side title="归档">
    <ul className={styles.list}>
      {
        props.value.map(({ year, month, count }, index) => {
          return <li key={index}>
            <Link href={`/archive/${year}/${month}`}>
              {year}年{month}月({count})
            </Link>
          </li>
        })
      }
    </ul>
  </Side>
}