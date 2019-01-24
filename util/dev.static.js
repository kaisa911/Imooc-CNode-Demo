const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs'); // 读写内存的工具
const path = require('path');
const proxy = require('http-proxy-middleware'); // express中间件，用来做代理的
const ReactDomServer = require('react-dom/server'); // 用reactDomServer取渲染打包好的bundle文件

const asyncBootstrap = require('react-async-bootstrapper');
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

let createStoreMap;

// 监听webpack的entry下面所有的依赖文件
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  // stats是webpack打包的一些信息
  const statsp = stats.toJson();
  // 输出这些打包信息
  statsp.errors.forEach(errp => console.error(errp)); // eslint-disable-line
  statsp.warnings.forEach(warning => console.warn(warning)); // eslint-disable-line

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
  // serverBundle 已经不是一个可以渲染的东西了，是一个方法
  serverBundle = m.exports.default;
  createStoreMap = m.exports.createStoreMap; // eslint-disable-line
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
        const routerContext = {};
        const stores = createStoreMap();
        const apq = serverBundle(stores, routerContext, req.url);
        asyncBootstrap(app)
          .then(() => {
            const content = ReactDomServer.renderToString(apq);
            // 对重定向的处理 如果有重定向的话，会在routerContext上加一个url的属性
            if (routerContext.url) {
              res.status(302).setHeader('Location', routerContext.url);
              res.end();
              return;
            }
            res.send(template.replace('<!-- app -->', content));
          })
          .catch((err) => {
            console.log(err); // eslint-disable-line
          });
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
