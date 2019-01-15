import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { AppContainer } from 'react-hot-loader';

// ReactDOM.hydrate(<App />, document.getElementById("root"));

const root = document.getElementById('root');

const render = Component => {
  
  // 判断当前环境，来判断使用render或者hydrate
  const isSSR = process.env.NODE_ENV === 'development' ? 'render' : 'hydrate';

  ReactDOM[isSSR](
    <AppContainer>
      <Component />
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
