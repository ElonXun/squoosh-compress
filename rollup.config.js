import babel from '@rollup/plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

import {terser} from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2'

const extensions = ['.js', '.ts'];

// 区分开发环境
const isDev = process.env.NODE_ENV === 'development';
console.log('fmn test isDev', isDev, process.env.NODE_ENV)
export default {
  input: 'lib/index.ts', // 入口文件
  output: 
  isDev? {
    format: 'umd',
    file: 'dist/index.js', // 打包后输出文件
    name: 'compress',  // 打包后的内容会挂载到window，name就是挂载到window的名称
    sourcemap: true // 代码调试  开发环境填true
  } : [
    {
      format: 'esm',
      file: 'dist/index.esm.js', // 打包后输出文件
    },
    {
      format: 'cjs',
      file: 'dist/index.cjs.js', // 打包后输出文件
    }
  ],
  plugins: [
    // 可以 import node_modules 中的模
    nodeResolve(),
    // 将 commonjs 规范的模块，转换为 es6
    commonjs(),
    // typescript 转换，只有最基础的转换，将 ts > es6
    typescript(),
    // babel 编译 ts 转换出的 es6 模块
    babel({
        exclude: "node_modules/**",
        babelHelpers: 'bundled',
        extensions,
    }),
    // 压缩代码
    isDev && terser(),
    // 热更新 默认监听根文件夹
    isDev && livereload(),
    // 本地服务器
    isDev && serve({
      open: true, // 自动打开页面
      port: 8000,
      openPage: '/index.html', // 打开的页面
      contentBase: ''
    })
  ]
}