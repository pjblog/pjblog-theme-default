import styles from './index.module.less';
import '../reset.css';
import '../styles.less';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Categories } from '../components/category';
import { ICategory } from '../types';
import { Flex } from '../components/Flex';

const finger: { value?: string } = {};
const OnlineContext = createContext<Record<'onlines' | 'members' | 'visitors', number>>({
  onlines: 0,
  members: 0,
  visitors: 0,
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
  const [onlines, setOnlines] = useState(0);
  const [members, setMembers] = useState(0);
  const [visitors, setVisitors] = useState(0);
  useEffect(() => {
    const eventSource = new EventSource('/-/online');
    eventSource.onmessage = event => {
      try {
        const { onlines, members, visitors } = JSON.parse(event.data);
        setOnlines(onlines);
        setMembers(members);
        setVisitors(visitors);
      } catch (e) { }
    }
    return () => eventSource.close();
  }, [])
  return <OnlineContext.Provider value={{ onlines, members, visitors }}>
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
            在线: {onlines} 人
            成员: {members} 人
            访客: {visitors} 人
          </span>
        </Flex>
      </footer>
    </div>
    <Toaster />
  </OnlineContext.Provider>
}

export function useOnline() {
  return useContext(OnlineContext);
}