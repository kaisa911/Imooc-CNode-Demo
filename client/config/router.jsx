import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import TopicList from '../views/topicList/index';
import TopicDetail from '../views/topicDetail/index';
import TestApi from '../views/test/api.test';

export default () => [
  <Route path="/" exact render={() => <Redirect to="/list" />} key="path:/" />,

  <Route path="/list" component={TopicList} key="path:/list" />,
  <Route path="/detail" component={TopicDetail} key="path:/detail" />,
  <Route path="/test" component={TestApi} key="path:/test" />,
];
