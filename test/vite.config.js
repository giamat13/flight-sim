import { defineConfig } from 'vite'

export default defineConfig({
  base: '/flight-sim/',
  server: {
    port: 5173,
    open: true
  }
});
