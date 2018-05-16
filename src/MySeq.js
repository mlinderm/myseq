import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import SourceContext from './contexts/SourceContext';
import SourceRoute from './components/SourceRoute';
import Navigation from './components/Navigation';
import LoadVcfFile from './components/LoadVcfFile';
import VariantQuery from './components/query/VariantQuery';

class MySeq extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
      samples: [],
      settings: props.settings,
    };

    this.setSource = this.setSource.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  setSource(source) {
    this.setState({ source });
    source.samples().then((samples) => {
      this.setState({ samples });
      this.updateSettings({ sample: samples[0] });
    });
  }

  updateSettings(settings) {
    this.setState({ settings: Object.assign({}, this.state.settings, settings) });
  }

  render() {
    const { samples, settings } = this.state;

    return (
      <SourceContext.Provider value={this.state.source}>
        <BrowserRouter>
          <main>
            <Navigation
              samples={samples}
              settings={settings}
              updateSettings={this.updateSettings}
            />
            <Container fluid>
              <Switch>
                <SourceRoute path="/" exact component={VariantQuery} />
                <Route
                  path="/load"
                  exact
                  render={renderProps =>
                    <LoadVcfFile {...renderProps} setSource={this.setSource} />
                  }
                />
                <SourceRoute path="/query" exact component={VariantQuery} />
              </Switch>
            </Container>
          </main>
        </BrowserRouter>
      </SourceContext.Provider>
    );
  }
}

MySeq.propTypes = {
  settings: PropTypes.shape({
    sample: PropTypes.string,
    assumeRefRef: PropTypes.bool,
  }),
};

MySeq.defaultProps = {
  settings: {
    sample: undefined,
    assumeRefRef: false,
  },
};

export default MySeq;
