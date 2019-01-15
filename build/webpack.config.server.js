const path = require('path');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

console.log('读取webpack server配置');

module.exports = webpackMerge(baseConfig, {
  target: 'node', // js 打包出来的内容的运行环境
  entry: {
    app: path.join(__dirname, '../client/server-entry.jsx'),
  },
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2', // 打包出来的js，使用的模块的方案
  },
  mode: 'development',
});
