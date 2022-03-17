import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'dist/index.js',
  output: {
    file: 'package/index.js',
    format: 'esm'
  },
  plugins: [

    json(),
    // terser()
  ]
}
