import styles from './index.module.less';
import { Categories, CategoryProvider } from '../category';
import { PropsWithChildren, Suspense } from 'react';
import { useConfigs } from '@pjblog/hooks';
import { Flex } from '../flex';
import { Typography, Divider } from 'antd';
import { User } from '../user';

export function Layout(props: PropsWithChildren<{}>) {
  const configs = useConfigs();
  return <CategoryProvider>
    <div className={styles.blog}>
      <div className={styles.container}>
        <Flex gap={8} className={styles.tools} align="right" valign="middle">
          <Suspense><Categories /></Suspense>
          <Divider type="vertical" />
          <User />
        </Flex>
        <Flex className={styles.title} align="between" valign="top">
          <div className={styles.name}>{configs.name}</div>
          <Flex className={styles.description} align="right" valign="bottom" direction="vertical" gap={[0, 8]}>
            <span>{configs.description}</span>
            <span>{configs.notice}</span>
          </Flex>
        </Flex>
        <div className={styles.main}>{props.children}</div>
      </div>
      <div className={styles.footer}>
        <Typography.Link href={configs.domain} target="_blank">{configs.copyright}</Typography.Link>
        <Divider type="vertical" />
        <Typography.Link>{configs.icp}</Typography.Link>
      </div>
    </div>
  </CategoryProvider>
}