import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Button from '@material-ui/core/Button';
import AppState from '../../store/appState';
import Container from '../layout/container';

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

  bootstrap = () => new Promise((resolve) => {
    setTimeout(() => {
      const { appState } = this.props;
      appState.count = 5;
      resolve(true);
    });
  });

  render() {
    const { appState } = this.props;
    const { msg } = appState;
    return (
      <Container>
        <Helmet>
          <title>topic list</title>
          <meta name="description" content="description" />
        </Helmet>
        <Button variant="outlined" color="primary">
          click me
        </Button>
        <input type="text" onChange={this.changeName} />
        <br />
        <span>{msg}</span>
      </Container>
    );
  }
}

export default TopicList;
