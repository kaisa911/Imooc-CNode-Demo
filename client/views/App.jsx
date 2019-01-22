import React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../config/router';

class App extends React.Component {
  componentDidMount() {
    // do something here
  }

  render() {
    return [
      <div key="nav">
        <Link to="/list">首页</Link>
        <br />
        <Link to="/detail">详情</Link>
        <br />
        <Link to="/test">测试</Link>
      </div>,
      <Routes key="route" />,
    ];
  }
}

export default App;
