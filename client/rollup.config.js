// rollup.config.js

import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';
import typescript from "@rollup/plugin-typescript"

const baseConfig = createSpaConfig();

export default merge(baseConfig, {
  input: './index.ts',
  output: {
      dir: 'build',
  },
  plugins: [typescript()]
});