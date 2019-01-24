import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import AppState from '../../store/appState';

@inject('appState')
@observer
class TopicList extends React.Component {
  static propTypes = {
    // eslint-disable-next-line
    appState: PropTypes.instanceOf(AppState).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // do somethings
  }

  changeName = (e) => {
    const { appState } = this.props;
    appState.changeName(e.target.value);
  };

  asyncBootstrap = () => new Promise((resolve) => {
    setTimeout(() => {
      const { appState } = this.props;
      appState.count = 3;
      resolve(true);
    });
  });

  render() {
    const { appState } = this.props;
    const { msg } = appState;
    this.asyncBootstrap();
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>{msg}</span>
      </div>
    );
  }
}

export default TopicList;
