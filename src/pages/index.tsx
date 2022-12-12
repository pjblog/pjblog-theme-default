import { Application, HistoryMode, withImport } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { BlogProvider } from '@pjblog/hooks';
import { BlogError, Layout } from '../components';

export default function(app: Application<HistoryMode>) {
  const client = new Client();

  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }

  // SSR 数据容器
  // 注入来自服务端数据
  app.use(ClientProvider, { client });
  
  // 博客基础数据注入
  app.use(BlogProvider, { 
    fallback: 'loading...',
    close: 'website closed...',
    forbiden: 'current user forbiden ...',
    error: BlogError,
  });

  app.use(Layout);

  const HOME = app.bind(
    '/', 
    ...withImport(() => import('./home'), { 
      fallback: 'loading...' 
    })
  );

  const ARTICLE = app.bind<{ code: string }>(
    '/article/:code', 
    ...withImport(() => import('./article'), { 
      fallback: 'loading...' 
    })
  );

  const LOGIN = app.bind(
    '/login', 
    ...withImport(() => import('./login'), { 
      fallback: 'loading...' 
    })
  );

  const REGISTER = app.bind(
    '/register', 
    ...withImport(() => import('./register'), { 
      fallback: 'loading...' 
    })
  );

  const PROFILE = app.bind(
    '/profile', 
    ...withImport(() => import('./profile'), { 
      fallback: 'loading...' 
    })
  );

  const PASSWORD = app.bind(
    '/password', 
    ...withImport(() => import('./password'), { 
      fallback: 'loading...' 
    })
  );

  return {
    HOME,
    ARTICLE,
    LOGIN,
    REGISTER,
    PROFILE,
    PASSWORD,
    client,
  }
}