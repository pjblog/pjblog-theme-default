import styles from './index.module.less';
import 'antd/es/style/reset.css';
import axios from 'axios';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Divider, Space, Typography } from 'antd';
import { Theme } from '../components/theme';
import { Categories } from '../components/category';
import { ICategory } from '../types';
import { Flex } from '../components/Flex';

const finger: { value?: string } = {};
const OnlineContext = createContext<{ total: number, list: string[] }>({
  total: 0,
  list: []
})
if (typeof window !== 'undefined') {
  import('@fingerprintjs/fingerprintjs')
    .then(FingerprintJS => FingerprintJS.load())
    .then(p => p.get())
    .then(({ visitorId }) => {
      finger.value = visitorId;
    })
}

axios.interceptors.request.use(request => {
  if (finger.value) {
    const headers = request.headers || {}
    // @ts-ignore
    request.headers = {
      ...headers,
      'x-finger': finger.value,
    }
  }
  return request;
})

export function Layout(props: PropsWithChildren<{
  title: string,
  description: string,
  categories: ICategory[],
  currentCategory?: number,
  url: string,
  icp: string,
  theme: string,
}>) {
  const [total, setTotal] = useState(0);
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const eventSource = new EventSource('/-/visitor');
    eventSource.onmessage = event => {
      try {
        const { online, list } = JSON.parse(event.data);
        setTotal(online);
        setList(list);
      } catch (e) {
        console.error(e, event.data)
      }
    }
    return () => eventSource.close();
  }, [])
  return <OnlineContext.Provider value={{ total, list }}>
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.header}>
          <Typography.Title level={1} className={styles.title}>{props.title}</Typography.Title>
          <Theme>
            <Typography.Text>{props.description}</Typography.Text>
          </Theme>
        </div>
        <div className={styles.category}>
          <Categories value={props.categories} current={props.currentCategory} url={props.url} />
        </div>
        <div className={styles.body}>{props.children}</div>
      </div>
      <footer className={styles.footer}>
        <Theme>
          <Flex direction="vertical" block align="center" valign="middle">
            <Space>
              <Typography.Text type="secondary">Using theme</Typography.Text>
              <Typography.Link type="secondary" href={'https://www.npmjs.com/' + props.theme} target="_blank">`{props.theme}`</Typography.Link>
            </Space>
            <Space>
              <Typography.Text type="secondary">CopyRight@2004-Present</Typography.Text>
              <Typography.Link type="secondary" href="https://www.pjhome.net/" target="_blank">PJBlog</Typography.Link>
              <Typography.Text type="secondary">All Rights Reserved.</Typography.Text>
              <Typography.Link type="secondary" href="https://beian.miit.gov.cn/" target="_blank">{props.icp}</Typography.Link>
            </Space>
            <Space>
              <Typography.Text type="secondary">在线: {total} 人 </Typography.Text>
              <Typography.Text type="secondary">成员: {list.filter(u => u.startsWith('user:')).length} 人</Typography.Text>
              <Typography.Text type="secondary">访客: {list.filter(u => u.startsWith('token:')).length} 人</Typography.Text>
            </Space>
          </Flex>
        </Theme>
      </footer>
    </div>
  </OnlineContext.Provider>
}

export function useOnline() {
  return useContext(OnlineContext);
}