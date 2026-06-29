import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite'; // <-- Lägg till denna

export default defineConfig({
  base: '/news/',
  plugins: [
    tailwindcss(), // <-- Lägg till denna FÖRE solidPlugin
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
});