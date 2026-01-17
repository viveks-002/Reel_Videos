import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './pages/login.html',
        signup: './pages/signup.html',
        feed: './pages/feed.html',
        upload: './pages/upload.html'
      }
    }
  }
});
