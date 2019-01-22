const router = require('express').Router();
const axios = require('axios');

const baseUrl = 'https://cnodejs.org/api/v1';

router.post('/login', (req, res, next) => {
  console.log(req.body.accessToken);
  axios
    .post(`${baseUrl}/accesstoken`, {
      accesstoken: req.body.accessToken,
    })
    .then((resp) => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url,
        };
        res.json({
          success: true,
          data: resp.data,
          msg: '',
        });
      }
    })
    .catch((err) => {
      // 如果是业务逻辑的错误
      if (err.response) {
        res.json({
          success: false,
          data: err.response.data,
          msg: '',
        });
      } else {
        next(err); // 将错误抛给全局错误处理器去处理
      }
    });
});

module.exports = router;
