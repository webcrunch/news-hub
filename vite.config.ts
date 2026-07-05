import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite'; // <-- Lägg till denna

export default defineConfig({

  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  base: '/news/',
  server: {
    port: 3000,
  },
});