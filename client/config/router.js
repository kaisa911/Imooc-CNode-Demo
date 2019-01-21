import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import TopicList from '../views/topicList/index';
import TopicDetail from '../views/topicDetail/index';

export default () => [
  <Route path="/" exact render={() => <Redirect to="/list" />} key="path:/" />,

  <Route path="/list" exact component={TopicList} key="path:/list" />,

  <Route path="/detail" exact component={TopicDetail} key="path:/detail" />,
];
