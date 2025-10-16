// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx(),
  ],
  image: {
    // service: {
    //   entrypoint: 'astro/assets/services/sharp',
    //   config: {
    //     limitInputPixels: false,
    //     defaults: {
    //       quality: 100,
    //     }
    //   },
    // }
    service: passthroughImageService(),
  },
});
