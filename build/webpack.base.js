const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'), // 文件的存放路径
    publicPath: '/public/', // 静态资源引用路径，用来区分静态资源或者api请求
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'], // 声明不需要写后缀名的module
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /(.jsx$)|(.js$)/,
        loader: 'eslint-loader',
        exclude: [path.join(__dirname, '../node_modules')],
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader',
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')],
      },
    ],
  },
};
