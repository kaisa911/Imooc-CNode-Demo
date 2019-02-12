const ReactDomServer = require('react-dom/server');
const asyncBootstrap = require('react-async-bootstrapper');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;

const { SheetsRegistry } = require('react-jss');
const create = require('jss').create; //eslint-disable-line
const preset = require('jss-preset-default').default;
const { createMuiTheme } = require('@material-ui/core/styles');
const { createGenerateClassName } = require('@material-ui/core/styles');
const colors = require('@material-ui/core/colors');

const getStoreState = stores => Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson(); // eslint-disable-line
  return result;
}, {});

module.exports = (bundle, template, req, res) => new Promise((resolve, reject) => {
  const createApp = bundle.default;
  const { createStoreMap } = bundle;

  const routerContext = {};
  const stores = createStoreMap();
  const sheetsRegistry = new SheetsRegistry();
  const jss = create(preset());
  jss.options.createGenerateClassName = createGenerateClassName;
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: colors.pink,
      accent: colors.lightBlue,
      type: 'light',
    },
  });

  const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url);

  asyncBootstrap(app)
    .then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url);
        res.end();
        return;
      }
      const helmet = Helmet.rewind();
      const state = getStoreState(stores);
      const content = ReactDomServer.renderToString(app);

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString(),
      });
      res.send(html);
      resolve();
    })
    .catch(reject);
});
