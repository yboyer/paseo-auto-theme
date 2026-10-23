import { URL } from 'node:url'

import config from '@yboyer/config/vite-plus'
import { defineConfig, mergeConfig } from 'vite-plus'

export default defineConfig(
  mergeConfig(config, {
    test: {
      include: ['tests/**/*.test.ts'],
      alias: { 'react-native': new URL('./tests/react-native.ts', import.meta.url).pathname },
    },
  })
)
