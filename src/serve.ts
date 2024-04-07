import Theme from './index.ts';
import Blog, { findPlugins } from '@pjblog/blog';
import ViteDevServer from '@pjblog/vite-middleware';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __configs_filepath = resolve(__dirname, '../blog.config.json');
const __package_filepath = resolve(__dirname, '../package.json');

const configs = require(__configs_filepath);
const pkg = require(__package_filepath);

findPlugins(Object.keys(pkg.dependencies))
  .then(plugins => Blog(configs, [...plugins, ViteDevServer, Theme]));