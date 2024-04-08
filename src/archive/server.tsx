import ViteDevServer from "@pjblog/vite-middleware";
import type { IMe } from '@pjblog/blog';
import { ArchivePage, MediaService, BlogVariable, CategoryCache } from "@pjblog/blog";
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server'
import { BlogMetaDataProvider } from "../metadata.ts";
import { IArchivePageProps, IHtmlProps } from "../types.ts";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const build = __dirname;
const dist = resolve(__dirname, '../dist');
const manifestServerFile = resolve(build, 'manifest.json');
const manifestClientFile = resolve(dist, 'manifest.json');

@ArchivePage.Injectable()
export default class MyHomePage extends ArchivePage {
  // 当前个人信息
  @ArchivePage.Inject('me')
  private readonly me: IMe;

  // 博客偏好设置数据
  @ArchivePage.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  // 开发模式下的 vite 对象
  @ArchivePage.Inject(ViteDevServer)
  private readonly context: ViteDevServer;

  // 基础博客数据
  @ArchivePage.Inject(BlogMetaDataProvider)
  private readonly metadata: BlogMetaDataProvider;

  // 首页媒体列表
  @ArchivePage.Inject(MediaService)
  private readonly media: MediaService;

  @ArchivePage.Inject(CategoryCache)
  private readonly categoryCache: CategoryCache;

  // 需要渲染的文件
  private readonly dev_file = resolve(__dirname, 'index.tsx');
  private readonly dev_html = resolve(__dirname, '../html.tsx');
  private readonly pro_file = 'src/archive/index.tsx';
  private readonly pro_html = 'src/html.tsx';
  private readonly pro_client = 'src/archive/client.tsx';

  // 渲染需要提供的数据源
  public async state(data: {
    page: number,
    type: string,
    category: number,
    url: string,
    year: number,
    month?: number,
    day?: number
  }): Promise<IArchivePageProps> {
    const size = this.configs.get('mediaQueryWithPageSize');
    const [res, total] = await this.media.getMany(data.page, size, {
      type: data.type,
      category: data.category,
      date: {
        year: data.year,
        month: data.month,
        day: data.day,
      }
    });
    const categories = await this.categoryCache.read();
    const hots = await this.media.hot(this.configs.get('mediaHotWithSize'), 'article');
    const latests = await this.media.latest(this.configs.get('mediaLatestWithSize'), 'article');
    return {
      me: this.me,
      medias: {
        data: res,
        total, size,
      },
      categories,
      hots,
      latests,
      location: {
        url: data.url,
        query: {
          page: data.page,
          type: data.type,
          category: data.category,
        },
        params: {
          year: data.year,
          month: data.month,
          day: data.day,
        }
      },
    }
  }

  // 渲染页面
  public async render(data: IArchivePageProps) {
    const metadata = this.metadata.get();
    const { Home, Html, client, css } = await this.getFiles();
    return renderToString(createElement(Html, {
      ...metadata,
      state: data,
      dev: !!this.context.vite,
      script: client,
      css: css,
    } satisfies IHtmlProps, createElement(Home, data)));
  }

  private async getFiles() {
    if (this.context.vite) {
      const [{ default: Home }, { default: Html }] = await Promise.all([
        this.context.vite.ssrLoadModule(this.dev_file, { fixStacktrace: true }),
        this.context.vite.ssrLoadModule(this.dev_html, { fixStacktrace: true }),
      ])
      return {
        Home, Html,
        client: '/src/archive/client.tsx',
        css: [],
      }
    } else {
      const manifest_server = require(manifestServerFile);
      const manifest_client = require(manifestClientFile);
      const [{ default: Home }, { default: Html }] = await Promise.all([
        import(resolve(build, manifest_server[this.pro_file].file)),
        import(resolve(build, manifest_server[this.pro_html].file)),
      ])
      const css: string[] = (manifest_client[this.pro_client]?.css || []).map(_ => this.transformAssets(_));
      // css.unshift(this.transformAssets('assets/antd.min.css'));
      if (manifest_client[this.pro_client].imports?.length) {
        for (let i = 0; i < manifest_client[this.pro_client].imports.length; i++) {
          const child = manifest_client[this.pro_client].imports[i];
          if (manifest_client[child]?.css) {
            css.push(...manifest_client[child].css.map(_ => this.transformAssets(_)))
          }
        }
      }
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