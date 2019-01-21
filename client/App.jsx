import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom'; // 浏览器的router react-router 的Route必须包裹在一个Router里面才能使用
import { Provider } from 'mobx-react';
import App from './views/App';

import appState from './store/appState';

const root = document.getElementById('root');

const render = (Component) => {
  // 判断当前环境，来判断使用render或者hydrate
  // const isSSR = process.env.NODE_ENV === 'development' ? 'render' : 'hydrate';

  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={appState}>
        <Router>
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
