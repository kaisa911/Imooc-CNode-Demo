const path = require("path");

module.exports = {
  target: "node", //js 打包出来的内容的运行环境
  entry: {
    app: path.join(__dirname, "../client/server-entry.js")
  },
  output: {
    filename: "server-entry.js",
    path: path.join(__dirname, "../dist"),
    publicPath: "/public/",
    libraryTarget: "commonjs2" // 打包出来的js，使用的模块的方案
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: "babel-loader"
      },
      {
        test: /.js$/,
        loader: "babel-loader",
        exclude: [path.join(__dirname, "../node_modules")]
      }
    ]
  }
};
