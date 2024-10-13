import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    VitePWA({
      // you can generate the icons using: https://favicon.io/favicon-converter/
      // and the maskable icon using: https://progressier.com/maskable-icons-editor
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My App',
        short_name: 'my-app',
        description: 'My App Description',
        theme_color: '#ffffff',
        start_url: "/",
        display: "fullscreen",
        orientation: "portrait",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_NAME__: JSON.stringify(process.env.npm_package_name),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lib/@mui/joy': ['@mui/joy'],
          'lib/react-markdown': ['react-markdown', 'rehype-raw', 'remark-gfm'],
        },
      },
    },
  },
})
