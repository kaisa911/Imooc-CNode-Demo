const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs'); // 读写内存的工具
const path = require('path');
const proxy = require('http-proxy-middleware'); // express中间件，用来做代理的
const NativeModule = require('module'); // module的构造函数
const vm = require('vm');
const serverRender = require('./server-render');

const serverConfig = require('../build/webpack.config.server'); // 用reactDomServer取渲染打包好的bundle文件
// 用http请求的方式，请求webpack devServer里的template的html
const getTemplate = () => new Promise((resolve, reject) => {
  axios
    .get('http://localhost:8888/public/server.ejs')
    .then((res) => {
      resolve(res.data);
    })
    .catch(reject);
});

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true,
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
};
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
  stats = stats.toJson(); // eslint-disable-line
  stats.errors.forEach(errp => console.error(errp));
  stats.warnings.forEach(warn => console.warn(warn));
  // 获取的bundle的路径
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);

  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  const m = getModuleFromString(bundle, 'server-entry.js');
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js') // 动态编译 指定文件名
  serverBundle = m.exports;
});

module.exports = (app) => {
  app.use(
    '/public',
    proxy({
      target: 'http://localhost:8888',
    })
  );

  /* eslint-disable */
  app.get('*', (req, res, next) => {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later');
    }
    getTemplate()
      .then(template => serverRender(serverBundle, template, req, res))
      .catch(next);
  });
  /* eslint-enable */
};
