import styles from './index.module.less';
import classnames from 'classnames';
import { parse } from 'marked';
import { PropsWithoutRef, useMemo } from "react";
import { IMedia } from "../types";

export function Page(props: PropsWithoutRef<{ media: IMedia }>) {
  const content = useMemo(() => parse(props.media.description), [props.media.description]);
  return <>
    <h2>{props.media.title}</h2>
    <div
      className={classnames('wmde-markdown', 'wmde-markdown-color', styles.markdown)}
      dangerouslySetInnerHTML={{ __html: content }} />
  </>
}