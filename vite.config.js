import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://16.171.10.128:8081',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Remove the Origin header or set it to the target
            // Setting it to the target URL's origin usually works best for strict backends
            proxyReq.setHeader('Origin', 'http://16.171.10.128:8081');
          });
        },
      },
    },
  },
})
