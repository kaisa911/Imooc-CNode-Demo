const express = require('express');
const ReactDomServer = require('react-dom/server');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const favicon = require('serve-favicon'); // 处理favicon
const handleLogin = require('../util/handleLogin');
const apiProxy = require('../util/proxy');
const devStatic = require('../util/dev.static'); // 开发环境下的处理方法

const isDev = process.env.NODE_ENV === 'development'; // 判断环境
console.log(isDev ? '开发环境' : '生产环境');

const app = express();

// 把application的请求格式的数据转化成IEQ.body上面的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 处理session
app.use(
  session({
    maxAge: 10 * 60 * 1000, // session 的存活期
    name: 'tid', // cookie的名字
    resave: false, // 每次请求不需要生成一个新的cookie Id
    saveUninitialized: false, // 同resave
    secret: 'react cnode class', // 用字符串加密cookie
  })
);

app.use(favicon(path.join(__dirname, '../favicon.ico')));

// 对api做一个拦截
app.use('/api/user', handleLogin);
app.use('/api', apiProxy);
console.log('232323');

// 判断环境
if (!isDev) {
  // 入口文件
  const serverEntry = require('../dist/server-entry').default; // eslint-disable-line
  // template 的html文件
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');

  // 处理静态文件的目录
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  // 处理请求
  app.get('*', (req, res) => {
    const appString = ReactDomServer.renderToString(serverEntry);
    res.send(template.replace('<!-- app -->', appString));
  });
} else {
  devStatic(app);
}

app.listen('3333', () => {
  console.log('server is listening on 3333');
});
