import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // adjust if you have multiple entry points
  format: ['esm', 'cjs'], // both module formats
  target: 'node18', // or whichever Node version you support
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true, // generate .d.ts files
  minify: true, // optional: true for production
})

