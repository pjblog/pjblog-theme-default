import ViteDevServer from "@pjblog/vite-middleware";
import type { IMe } from '@pjblog/blog';
import { DetailPgae, BlogVariable, CategoryCache, MediaService, MediaArticleService, Media, MediaTagService, MediaCommentService } from "@pjblog/blog";
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Context } from '@zille/core';
import { BlogMetaDataProvider } from "../metadata.ts";
import { IArticle, IDetailPageProps, IHomePageProps, IHtmlProps } from "../types.ts";
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const require = createRequire(import.meta.url);
const build = __dirname;
const dist = resolve(__dirname, '../dist');
const manifestServerFile = resolve(build, 'manifest.json');
const manifestClientFile = resolve(dist, 'manifest.json');

@DetailPgae.Injectable()
export default class MyHomePage extends DetailPgae {
  // 当前个人信息
  @DetailPgae.Inject('me')
  private readonly me: IMe;

  // 博客偏好设置数据
  @DetailPgae.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  // 开发模式下的 vite 对象
  @DetailPgae.Inject(ViteDevServer)
  private readonly context: ViteDevServer;

  // 基础博客数据
  @DetailPgae.Inject(BlogMetaDataProvider)
  private readonly metadata: BlogMetaDataProvider;

  // 首页媒体列表
  @DetailPgae.Inject(MediaService)
  private readonly media: MediaService;

  @DetailPgae.Inject(CategoryCache)
  private readonly categoryCache: CategoryCache;

  // 需要渲染的文件
  private readonly dev_file = resolve(__dirname, 'index.tsx');
  private readonly dev_html = resolve(__dirname, '../html.tsx');
  private readonly pro_file = 'src/detail/index.tsx';
  private readonly pro_html = 'src/html.tsx';
  private readonly pro_client = 'src/detail/client.tsx';

  // 渲染需要提供的数据源
  public async state(data: {
    page: number,
    token: string,
    url: string
  }, context: Context): Promise<IDetailPageProps> {
    const rootSize = this.configs.get('mediaCommentWithPageSize');
    const childSize = this.configs.get('mediaCommentWithChildrenPageSize');
    const commentable = this.configs.get('mediaCommentable');
    const categories = await this.categoryCache.read();
    const hots = await this.media.hot(this.configs.get('mediaHotWithSize'), 'article');
    const latests = await this.media.latest(this.configs.get('mediaLatestWithSize'), 'article');
    const media = await this.media.getOneByToken(data.token);
    const { category, user } = await this.media.getMore(media.id);
    context.addCache(Media.Middleware_Store_NameSpace, media);
    let article: IArticle;
    switch (media.media_type) {
      case 'article':
        const Article = await this.$use(MediaArticleService);
        const Tag = await this.$use(MediaTagService);
        const Comment = await this.$use(MediaCommentService);
        const _article = await Article.getOne();
        const tags = await Tag.getMany();
        const comments = await Comment.getMany(data.page, rootSize, 0);
        article = {
          markdown: _article.markdown,
          md5: _article.md5,
          source: _article.source,
          comments: {
            data: comments[0],
            total: comments[1],
            rootSize,
            childSize,
            commentable: media.commentable || commentable,
          },
          tags: tags.map(tag => ({
            id: tag.id,
            name: tag.tag_name,
          }))
        }
        break;
    }
    return {
      me: this.me,
      categories,
      hots,
      latests,
      article,
      location: {
        url: data.url,
        query: {
          page: data.page,
        },
        params: {
          token: data.token,
        }
      },
      media: {
        title: media.media_title,
        category,
        user,
        readCount: media.media_read_count,
        type: media.media_type,
        commentable: media.commentable,
        gmtc: media.gmt_create,
        gmtm: media.gmt_modified,
        description: media.media_type === 'page' ? media.media_description : undefined,
      }
    }
  }

  // 渲染页面
  public async render(data: IHomePageProps) {
    const metadata = this.metadata.get();
    const { Detail, Html, client, css } = await this.getFiles();
    const cache = createCache();
    const child = !this.context.vite
      ? createElement(StyleProvider, { cache }, createElement(Detail, data))
      : createElement(Detail, data)
    const html = renderToString(createElement(Html, {
      ...metadata,
      state: data,
      dev: !!this.context.vite,
      script: client,
      css: css,
    } satisfies IHtmlProps, child));
    const styleText = extractStyle(cache);
    return html + styleText;
  }

  private async getFiles() {
    if (this.context.vite) {
      const [{ default: Detail }, { default: Html }] = await Promise.all([
        this.context.vite.ssrLoadModule(this.dev_file, { fixStacktrace: true }),
        this.context.vite.ssrLoadModule(this.dev_html, { fixStacktrace: true }),
      ])
      return {
        Detail, Html,
        client: '/src/detail/client.tsx',
        css: [],
      }
    } else {
      const manifest_server = require(manifestServerFile);
      const manifest_client = require(manifestClientFile);
      const [{ default: Detail }, { default: Html }] = await Promise.all([
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
        Detail, Html,
        client: this.transformAssets(manifest_client[this.pro_client].file),
        css,
      }
    }
  }

  private transformAssets(url: string) {
    return '/~/' + url
  }
}