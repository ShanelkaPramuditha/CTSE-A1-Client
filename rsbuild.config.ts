import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { SYSTEM_INFO } from './src/constants';

const devPort = Number(process.env.PORT || process.env.PUBLIC_DEV_PORT) || 5730;

export default defineConfig({
  html: {
    title: SYSTEM_INFO.name,
  },
  server: {
    port: devPort,
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
});
