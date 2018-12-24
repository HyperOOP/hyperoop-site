import typescript from 'rollup-plugin-typescript2';
import resolve    from 'rollup-plugin-node-resolve';
import commonjs   from 'rollup-plugin-commonjs';

export default {
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        resolve(),
        commonjs({
            namedExports: {
              'node_modules/scroll-into-view/scrollIntoView.js': [ 'default' ]
            }
        })
    ]
}