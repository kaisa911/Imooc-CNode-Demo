import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';
import AppState from './store/appState';

const root = document.getElementById('root');

// 根据每个类创建store
// const stores = {
//   appState: new AppState(),
// };

const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const render = (Component) => {
  // 判断当前环境，来判断使用render或者hydrate
  // const isSSR = process.env.NODE_ENV === 'development' ? 'render' : 'hydrate';

  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
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
