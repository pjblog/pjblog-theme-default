import { Application, HistoryMode, Path } from "@codixjs/codix";
import { Client } from '@codixjs/fetch';

export function useBlogRouters(app: Application<HistoryMode>) {
  const Article = app.path('/');
  const ArticleDetail = app.path<{ id: string }>('/article/:id([\\w\\d]+)');
  const Login = app.path('/login');
  const Register = app.path('/register');
  const Profile = app.path('/profile');
  const Password = app.path('/password');
  const Link = app.path('/link');

  const createExports = (client: Client, ...pathes: Path[]) => {
    return {
      Article,
      ArticleDetail,
      Login,
      Register,
      Profile,
      Password,
      Link,
      client,
      ...pathes,
    }
  }

  return {
    Article,
    ArticleDetail,
    Login,
    Register,
    Profile,
    Password,
    Link,
    createExports,
  }
}