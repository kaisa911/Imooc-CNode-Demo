const axios = require('axios');
const querystring = require('query-string');

const baseUrl = 'https://cnodejs.org/api/v1';

module.exports = (req, res) => {
  const { path } = req;
  const user = req.session.user || {};
  const { needAccessToken } = req.query;

  // 如果需要token，并且user里没有token，返回401
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login',
    });
  }

  const query = Object.assign({}, req.query, {
    accesstoken: needAccessToken && req.method === 'GET' ? user.accesstoken : '',
  });
  if (query.accessToken) delete query.accessToken;

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: querystring.stringify(
      Object.assign({}, req.body, {
        // 放在body中了
        accesstoken: needAccessToken && req.method === 'POST' ? user.accessToken : '',
      })
    ),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // 使用form-data的类型去请求，不使用application／json的
    },
  })
    .then((resp) => {
      if (resp.status === 200) {
        res.send(resp.data);
      } else {
        res.status(resp.status).send(resp.data);
      }
    })
    .catch((err) => {
      if (err.response) {
        res.status(500).send(err.response.data);
      } else {
        res.status(500).send({
          success: false,
          msg: '未知错误',
        });
      }
    });
};
