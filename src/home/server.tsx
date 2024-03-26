import ViteDevServer from "@pjblog/vite-middleware";
import { HomePage, MediaService, BlogVariable, CategoryCache } from "@pjblog/blog";
import type { IMe } from '@pjblog/blog';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server'
import { BlogMetaDataProvider } from "../metadata.ts";
import { IHomePageProps, IHtmlProps } from "../types.ts";
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const build = __dirname;
const dist = resolve(__dirname, '../dist');
const manifestServerFile = resolve(build, 'manifest.json');
const manifestClientFile = resolve(dist, 'manifest.json');

@HomePage.Injectable()
export default class MyHomePage extends HomePage {
  // 当前个人信息
  @HomePage.Inject('me')
  private readonly me: IMe;

  // 博客偏好设置数据
  @HomePage.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  // 开发模式下的 vite 对象
  @HomePage.Inject(ViteDevServer)
  private readonly context: ViteDevServer;

  // 基础博客数据
  @HomePage.Inject(BlogMetaDataProvider)
  private readonly metadata: BlogMetaDataProvider;

  // 首页媒体列表
  @HomePage.Inject(MediaService)
  private readonly media: MediaService;

  @HomePage.Inject(CategoryCache)
  private readonly categoryCache: CategoryCache;

  // 需要渲染的文件
  private readonly dev_file = resolve(__dirname, 'index.tsx');
  private readonly dev_html = resolve(__dirname, '../html.tsx');
  private readonly pro_file = 'src/home/index.tsx';
  private readonly pro_html = 'src/html.tsx';
  private readonly pro_client = 'src/home/client.tsx';

  // 渲染需要提供的数据源
  public async state(data: { page: number, type: string, category: number, url: string }): Promise<IHomePageProps> {
    const size = this.configs.get('mediaQueryWithPageSize');
    const res = await this.media.getMany(data.page, size, { type: data.type, category: data.category });
    const categories = await this.categoryCache.read();
    return {
      metadata: this.metadata.blogMetaData(),
      page: data.page,
      type: data.type,
      category: data.category,
      url: data.url,
      me: this.me,
      medias: res,
      categories,
    }
  }

  // 渲染页面
  public async render(data: IHomePageProps) {
    const htmlMetadata = this.metadata.htmlMetaData();
    const { Home, Html, client, css } = await this.getFiles();
    return renderToString(createElement(Html, {
      ...htmlMetadata,
      state: data,
      url: data.url,
      dev: this.context.vite ? true : false,
      script: client,
      css: css,
    } satisfies IHtmlProps, createElement(Home, { state: data })));
  }

  private async getFiles() {
    if (this.context.vite) {
      const [{ default: Home }, { default: Html }] = await Promise.all([
        this.context.vite.ssrLoadModule(this.dev_file, { fixStacktrace: true }),
        this.context.vite.ssrLoadModule(this.dev_html, { fixStacktrace: true }),
      ])
      return {
        Home, Html,
        client: '/src/home/client.tsx',
        css: [],
      }
    } else {
      const manifest_server = require(manifestServerFile);
      const manifest_client = require(manifestClientFile);
      const [{ default: Home }, { default: Html }] = await Promise.all([
        import(resolve(build, manifest_server[this.pro_file].file)),
        import(resolve(build, manifest_server[this.pro_html].file)),
      ])
      const css: string[] = (manifest_client[this.pro_client]?.css || []).map(css => this.transformAssets(css));
      css.unshift(this.transformAssets('assets/antd.min.css'));
      return {
        Home, Html,
        client: this.transformAssets(manifest_client[this.pro_client].file),
        css,
      }
    }
  }

  private transformAssets(url: string) {
    return '/~/' + url
  }
}