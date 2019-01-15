const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' // 判断是否处于开发模式，而值是在启动的时候设置的。

const config = {
  entry: {
    app: path.join(__dirname, '../client/app.jsx')
  },
  output: {
    filename: '[name].[hash].js', // 最长使用浏览器缓存的目的
    path: path.join(__dirname, '../dist'), // 文件的存放路径
    publicPath: '/public/' // 静态资源引用路径，用来区分静态资源或者api请求
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
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
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }) // 生成一个html页面，把entry的东西注入到这个html里
  ]
}

if (isDev) {
  console.log('读取webpack dev配置')
  config.devtool = 'inline-source-map'
  config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.jsx')] // 因为在.babelrc里添加了一个插件，所以入口就变成，把插件里的patch和app.js都打包进去
  }
  config.devServer = {
    host: '0.0.0.0', // 0.0.0.0 是指可以使用任何方式来访问
    port: '8888',
    contentBase: path.join(__dirname, '../dist'), // 静态文件打包出来的路径
    hot: true, // 热更替
    overlay: {
      errors: true
    }, // webpack 编译的过程中，出现错误，在网页上出现一个黑色的弹窗。
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    } // 制定index 映射到那个文件
  }
  config.performance = {
    // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
    hints: 'warning',
    // 开发环境设置较大防止警告
    // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
    maxEntrypointSize: 5000000,
    // 最大单个资源体积，默认250000 (bytes)
    maxAssetSize: 3000000
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin()) // webpack 的热更替插件
}

module.exports = config
