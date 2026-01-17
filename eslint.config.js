//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['public/**', 'dist/**', 'node_modules/**', '*.config.js'],
  },
]
