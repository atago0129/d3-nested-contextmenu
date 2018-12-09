import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

const name = "d3-nested-contextmenu";

export default {
  input: './index.js',
  output: [
    {
      file: './lib/' + name + '.es.js',
      format: 'es'
    },
    {
      file: './lib/' + name + '.js',
      format: 'umd',
      name: 'd3',
      globals: {
        'd3': 'd3',
      },
      extend: true
    }
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
          moduleResolution: "node",
          target: "es5"
        }
      }
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [
    'd3'
  ]
}