import json from '@rollup/plugin-json';
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
};
