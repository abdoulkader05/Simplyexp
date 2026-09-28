// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeTypoFr from './src/lib/rehype-typo-fr.mjs';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    // trust : autorise \htmlClass pour le code couleur des rôles (design-system)
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { trust: true, strict: false }], rehypeTypoFr],
    }),
  },
  vite: {
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  },
});
