import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom'; // 浏览器的router
import { Provider } from 'mobx';
import App from './views/App';

import appState from './store/appState';

const root = document.getElementById('root');

const render = (Component) => {
  // 判断当前环境，来判断使用render或者hydrate
  const isSSR = process.env.NODE_ENV === 'development' ? 'render' : 'hydrate';

  ReactDOM[isSSR](
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  );
};

render(App);

if (module.hot) {
  module.hot.accept(App, () => {
    const NextApp = App;
    render(NextApp);
  });
}
