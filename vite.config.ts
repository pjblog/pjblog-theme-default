import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const pkg = require('./package.json')

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: codixServer } = await import('@codixjs/vite');
  return {
    base: '/theme/',
    resolve: {
      extensions: [
        '.tsx', 
        '.ts', 
        '.jsx', 
        '.js', 
        '.json', 
        '.less', 
        '.css'
      ],
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {}
        },
      }
    },
    build: {
      rollupOptions: {
        manualChunks: {
          vonder: [
            'react', 
            'react-dom',
            'antd',
            '@ant-design/icons'
          ],
        }
      }
    },
    optimizeDeps: {
      include: ["react/jsx-runtime", "react", "react-dom"],
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
          ],
        }
      }),
      codixServer(pkg.config)
    ],
    server: {
      proxy: {
        "/api": {
          changeOrigin: true,
          target: "http://127.0.0.1:8000",
        }
      }
    }
  }
})
