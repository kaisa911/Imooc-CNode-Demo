const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs'); // 读写内存的工具
const path = require('path');
const proxy = require('http-proxy-middleware'); // express中间件，用来做代理的
const ReactDomServer = require('react-dom/server'); // 用reactDomServer取渲染打包好的bundle文件

const serverConfig = require('../build/webpack.config.server'); // 引入webpack的server的配置

// 用http请求的方式，请求webpack devServer里的template的html
const getTemplate = () => new Promise((resolve, reject) => {
  axios
    .get('http://localhost:8888/public/index.html') // 获取这个html
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

// module的构造函数
const Module = module.constructor;

// 从内存里读写文件
const mfs = new MemoryFs();
// compiler，用来监听依赖是否有变化，如果有变化，就会重新打包
const serverCompiler = webpack(serverConfig);

// 指定webpack的输出文件等于这个内存路径？
serverCompiler.outputFileSystem = mfs;

let serverBundle;

// 监听webpack的entry下面所有的依赖文件
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  // stats是webpack打包的一些信息
  const statsp = stats.toJson();
  // 输出这些打包信息
  statsp.errors.forEach(errp => console.error(errp));
  statsp.warnings.forEach(warning => console.warn(warning));

  // 获取的bundle的路径
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);

  // 获取bundle文件
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');

  /**
   * 一个module的实例，来解析string的内容，来生成一个新的模块
   */
  const m = new Module();

  // eslint-disable-next-line
  m._compile(bundle, 'server-entry.js');
  // 将bundle模块export出去
  serverBundle = m.exports.default;
});

module.exports = (app) => {
  app.use(
    '/public/',
    proxy({
      target: 'http://0.0.0.0:8888/',
      changeOrigin: true,
    })
  );

  app.get('*', (req, res) => {
    getTemplate()
      .then((template) => {
        const content = ReactDomServer.renderToString(serverBundle);
        res.send(template.replace('<!-- app -->', content));
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
};
