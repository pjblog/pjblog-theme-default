import styles from './index.module.less';
import '../reset.css';
import axios from 'axios';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
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
    const eventSource = new EventSource('/-/online');
    eventSource.onmessage = event => {
      try {
        const { online, list } = JSON.parse(event.data);
        setTotal(online);
        setList(list);
      } catch (e) { }
    }
    return () => eventSource.close();
  }, [])
  return <OnlineContext.Provider value={{ total, list }}>
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.header}>
          <h1 className={styles.title}>{props.title}</h1>
          <span className={styles.slogen}>{props.description}</span>
        </div>
        <div className={styles.category}>
          <Categories value={props.categories} current={props.currentCategory} url={props.url} />
        </div>
        <div className={styles.body}>{props.children}</div>
      </div>
      <footer className={styles.footer}>
        <Flex direction="vertical" block align="center" valign="middle" gap={[0, 4]}>
          <span>Using theme <a href={'https://www.npmjs.com/' + props.theme} target="_blank">{props.theme}</a></span>
          <span>CopyRight@2004-Present <a href="https://www.pjhome.net/" target="_blank">PJBlog</a> All Rights Reserved. <a href="https://beian.miit.gov.cn/" target="_blank">{props.icp}</a></span>
          <span>
            在线: {total} 人
            成员: {list.filter(u => u.startsWith('user:')).length} 人
            访客: {list.filter(u => u.startsWith('token:')).length} 人
          </span>
        </Flex>
      </footer>
    </div>
  </OnlineContext.Provider>
}

export function useOnline() {
  return useContext(OnlineContext);
}