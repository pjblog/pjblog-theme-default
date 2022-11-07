const path = require('path');
const clientDictionary = path.resolve(__dirname, 'dist', 'ssr', 'client');

module.exports = {
  static: path.resolve(__dirname, 'dist', 'ssr', 'client'),
  createMiddleware: async (state) => {
    const { getAssets } = await import('@codixjs/vite');
    const render = await import('./dist/ssr/server/server.mjs');
    const assets = await getAssets('/theme/', 'src/entries/client.tsx', clientDictionary);
    return (req, res, next) => {
      req.HTMLAssets = assets;
      req.HTMLStates = state;
      render.default.middleware(req, res, next);
    }
  }
}