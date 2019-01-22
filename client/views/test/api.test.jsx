import React from 'react';
import axios from 'axios';

/* eslint-disable */
export default class TestApi extends React.Component {
  componentDidMount() {
    // do something here...
  }

  getTopics = () => {
    axios
      .get('/api/topics')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  login = () => {
    axios
      .post('/api/user/login', {
        accessToken: '5a7f345b-9817-4c93-91a1-0dcda2d132f7',
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  markAll = () => {
    axios
      .post('/api/message/mark_all?needAccessToken=true')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.getTopics} type="button">
          topics
        </button>
        <button onClick={this.login} type="button">
          login
        </button>
        <button onClick={this.markAll} type="button">
          markAll
        </button>
      </div>
    );
  }
}
/* eslint-enable */
