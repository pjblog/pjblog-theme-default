import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
    {
      name: 'vite:pjblog:build',
      apply: 'build',
      config(_, { command, ssrBuild }) {
        if (command !== 'build') return;
        if (ssrBuild) {
          return {
            build: {
              ssr: true,
              outDir: resolve('build'),
              manifest: true,
              rollupOptions: {
                input: {
                  index: resolve('src/index.ts'),
                  preview: resolve('src/preview.ts'),
                  html: resolve('src/html.tsx'),
                  home: resolve('src/home/index.tsx'),
                }
              }
            },
            ssr: {
              format: 'esm',
            }
          }
        } else {
          return {
            build: {
              manifest: true,
              outDir: resolve('dist'),
              rollupOptions: {
                input: {
                  home: resolve('src/home/client.tsx'),
                }
              }
            }
          }
        }
      }
    }
  ],
})
