import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import TopicList from '../views/topicList/index';
import TopicDetail from '../views/topicDetail/index';

export default () => (
  <div>
    <Route path="/" exact render={() => <Redirect to="/list" />} />

    <Route path="/list" exact component={TopicList} />

    <Route path="/detail" exact component={TopicDetail} />
  </div>
);
