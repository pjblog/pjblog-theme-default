import crypto from 'crypto-js';
import HomePage from './home/server.tsx';
import DetailPage from './detail/server.tsx';
import send from 'koa-send';
import { Plugin, SchemaBase } from "@pjblog/blog";
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Middleware, Context } from 'koa';
import { HttpMiddlewares } from '@zille/http';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkg = require('../package.json');
const { MD5 } = crypto;
const readmeText = readFileSync(resolve(__dirname, '../README.md'), 'utf8');
const distDirectory = resolve(__dirname, '../dist');

@Plugin.Injectable()
export default class extends Plugin {
  public readonly cwd: string = __dirname;
  public readonly code: string = MD5(pkg.name).toString();
  public readonly version: string = pkg.version;
  public readonly name: string = pkg.name;
  public readonly description: string = pkg.description;
  public readonly readme: string = readmeText;
  public readonly cover: string = null;
  public readonly advanceStaticDirectory: string = null;
  public readonly previews: string[] = [];
  public readonly schema: SchemaBase = null;

  @Plugin.Inject(HttpMiddlewares)
  private readonly HttpMiddlewares: HttpMiddlewares;

  public async initialize() {
    await this.$theme('home', HomePage);
    await this.$theme('detail', DetailPage);
    const middleware: Middleware = async (ctx, next) => {
      if (!ctx.url.startsWith('/~')) return await next();
      const pathname = ctx.url.substring('/~'.length) || '/';
      try {
        await this.serveStatic(ctx, pathname, distDirectory);
      } catch (e) {
        if (e.status === 404) {
          await this.serveStatic(ctx, '/', distDirectory);
        } else {
          throw e;
        }
      }
    }
    this.HttpMiddlewares.add('prefix', middleware);
    return () => this.HttpMiddlewares.del('prefix', middleware);
  }

  private serveStatic(ctx: Context, path: string, directory: string, maxAge = 24 * 60 * 60 * 1000) {
    return send(ctx, path, {
      root: directory,
      index: 'index.html',
      gzip: true,
      maxAge,
    })
  }
}