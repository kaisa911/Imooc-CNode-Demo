import React from 'react';
import { StaticRouter } from 'react-router-dom'; // 服务端渲染的路由
import { Provider, useStaticRendering } from 'mobx-react';
import App from './views/App';
import { createStoreMap } from './store/store';

// 让mobx在服务端渲染的时候不会重复的数据变换
useStaticRendering(true);

// store 每次都要重新创建一次，因为不能同一个store在不同的请求里使用它
// context
// location 是请求的 url
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
);

export { createStoreMap };
