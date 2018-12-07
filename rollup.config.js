import typescript from 'rollup-plugin-typescript2';
import resolve    from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        resolve(),
        //terser()
    ]
}