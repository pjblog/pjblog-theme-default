import { Application, HistoryMode, withImport } from '@codixjs/codix';
import { Client, ClientProvider } from '@codixjs/fetch';
import { Suspense } from 'react';
import { UserInfoProvider, useBlogRouters } from '../components';
import { Layout } from '../layout';

export default function(app: Application<HistoryMode>) {
  const client = new Client();
  const { 
    createExports, 
    Article,
    Register,
    Login,
    Profile,
    Password,
    Link,
    ArticleDetail,
  } = useBlogRouters(app);

  if (typeof window !== 'undefined' && window.INITIALIZE_STATE) {
    client.initialize(window.INITIALIZE_STATE);
  }

  app.use(ClientProvider, { client });
  app.use(Suspense, { fallback: 'loading...' });
  app.use(UserInfoProvider);
  app.use(Suspense, { fallback: 'loading...' });
  app.use(Layout);

  Article.use(...withImport(() => import('./home'), { fallback: 'loading...' }));
  Register.use(...withImport(() => import('./register'), { fallback: 'loading...' }));
  Login.use(...withImport(() => import('./login'), { fallback: 'loading...' }));
  Profile.use(...withImport(() => import('./profile'), { fallback: 'loading...' }));
  Password.use(...withImport(() => import('./password'), { fallback: 'loading...' }));
  Link.use(...withImport(() => import('./link'), { fallback: 'loading...' }));
  ArticleDetail.use(...withImport(() => import('./detail'), { fallback: 'loading...' }));

  return createExports(client);
}