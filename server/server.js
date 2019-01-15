const express = require('express');
const ReactDomServer = require('react-dom/server');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon'); // 处理favicon
const devStatic = require('../util/dev.static'); // 开发环境下的处理方法

const isDev = process.env.NODE_ENV === 'development'; // 判断环境

const app = express();

app.use(favicon(path.join(__dirname, '../favicon.ico')));

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
