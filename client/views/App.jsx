import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Routes from '../config/router';

@inject('routing')
@observer
class App extends React.Component {
  componentDidMount() {
    // do somethings
  }

  render() {
    return (
      <div>
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情</Link>
        <Routes />
      </div>
    );
  }
}

export default withRouter(App);
