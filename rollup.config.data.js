import resolve    from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        resolve(),
        //terser()
    ]
}