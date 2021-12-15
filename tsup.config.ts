import { defineConfig } from 'tsup';

export default defineConfig(({ watch }) => ({
  format: ['esm'],
  entry: ['main.js'],
  target: 'esnext',
  clean: true,
  minify: !watch
}));
