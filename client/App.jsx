import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router } from 'react-router'; // 浏览器的router
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Provider } from 'mobx-react';
import App from './views/App';

import appState from './store/appState';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const stores = {
  // Key can be whatever you want
  routing: routingStore,
  // ...other stores
  appState,
};

const history = syncHistoryWithStore(browserHistory, routingStore);

const root = document.getElementById('root');

const render = (Component) => {
  // 判断当前环境，来判断使用render或者hydrate
  const isSSR = process.env.NODE_ENV === 'development' ? 'render' : 'hydrate';

  ReactDOM[isSSR](
    <AppContainer>
      <Provider {...stores}>
        <Router history={history}>
          <Component />
        </Router>
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
