const path = require('path');
const clientDictionary = path.resolve(__dirname, 'dist', 'ssr', 'client');

module.exports = {
  static: path.resolve(__dirname, 'dist', 'ssr', 'client'),
  createMiddleware: async (state) => {
    const { getAssets } = await import('@codixjs/vite');
    const render = await import('./dist/ssr/server/server.mjs');
    const assets = await getAssets(render.default.prefix, 'src/entries/client.tsx', clientDictionary);
    return async (ctx, next) => {
      const req = ctx.req;
      const res = ctx.res;
      req.HTMLAssets = assets;
      req.HTMLStates = state;
      await new Promise((resolve) => render.default.middleware(req, res, resolve));
      await next();
    }
  }
}