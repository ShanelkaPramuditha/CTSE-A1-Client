import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { SYSTEM_INFO } from './src/constants';

export default defineConfig({
  html: {
    title: SYSTEM_INFO.name,
  },
  plugins: [pluginReact()],
  server: {
    port: 3001, // Change this to your desired port number
  },
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