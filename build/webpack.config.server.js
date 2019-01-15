const path = require('path')

console.log('读取webpack server配置')

module.exports = {
  target: 'node', // js 打包出来的内容的运行环境
  entry: {
    app: path.join(__dirname, '../client/server-entry.jsx')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/',
    libraryTarget: 'commonjs2' // 打包出来的js，使用的模块的方案
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /(.jsx$)|(.js$)/,
        loader: 'eslint-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      }
    ]
  }
}
