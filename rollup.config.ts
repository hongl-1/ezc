import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: {
    file: 'index.js',
    format: 'esm'
  },
  plugins: [
    typescript(),
    commonjs({
      exclude: ['/node_modules/']
    }),
    json(),
    // terser()
  ]
}
