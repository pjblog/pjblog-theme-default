import Theme from './index.ts';
import Blog from '@pjblog/blog';
import ViteDevServer from '@pjblog/vite-middleware';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { container } from '@zille/application';
import { Configurator } from '@zille/configurator';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __configs_filepath = resolve(__dirname, '../blog.config.json');
const __package_filepath = resolve(__dirname, '../package.json');

const configs = require(__configs_filepath);
const pkg = require(__package_filepath);
const viteConfigFile = resolve(__dirname, '../vite.config.ts');
const viteRoot = resolve(__dirname, '..');

ViteConfigurator()
  .then(() => findPlugins(Object.keys(pkg.dependencies)))
  .then(plugins => Blog(configs, [...plugins, ViteDevServer, Theme]));

async function findPlugins(dependencies: string[]) {
  const plugin: any[] = [];
  for (let i = 0; i < dependencies.length; i++) {
    const dependency = dependencies[i];
    if (matchTheme(dependency) || matchPlugin(dependency)) {
      const path = require.resolve(dependency);
      const { default: Plugin } = await import(path);
      plugin.push(Plugin);
    }
  }
  return plugin;
}

function matchTheme(name: string) {
  return name.startsWith('pjblog-theme-');
}

function matchPlugin(name: string) {
  return name.startsWith('pjblog-plugin-');
}

async function ViteConfigurator() {
  const configs = await container.connect(Configurator);
  configs.set(ViteDevServer.ConfigFile, viteConfigFile);
  configs.set(ViteDevServer.Root, viteRoot);
}