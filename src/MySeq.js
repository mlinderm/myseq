import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import SourceContext from './contexts/SourceContext';
import SettingsContext, { defaultSettings, settingsPropType } from './contexts/SettingsContext';
import SourceRoute from './components/SourceRoute';
import Navigation from './components/Navigation';

import Settings from './components/Settings';
import LoadVcfFile from './components/LoadVcfFile';
import VariantQuery from './components/query/VariantQuery';
import Traits from './components/traits/Traits';
import PGx from './components/pgx/PGx';
import Risks from './components/risks/Risks';
import AncestryPCA from './components/ancestry/AncestryPCA';
import ChromosomePainting from './components/chromosomepainting/painting';

class MySeq extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source: null,
      samples: [],
      settings: Object.assign({}, defaultSettings, props.settings),
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
    const { source, samples, settings } = this.state;

    return (
      <SettingsContext.Provider value={settings}>
        <SourceContext.Provider value={source}>
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
                    render={rp =>
                      (<LoadVcfFile
                        {...rp}
                        setSource={this.setSource}
                        updateSettings={this.updateSettings}
                      />)
                    }
                  />
                  <Route
                    path="/settings"
                    exact
                    render={rp =>
                      <Settings {...rp} settings={settings} updateSettings={this.updateSettings} />
                    }
                  />
                  <SourceRoute path="/query" exact component={VariantQuery} />
                  <Route path="/traits" component={Traits} />
                  <Route path="/pgx" component={PGx} />
                  <Route path="/risks" component={Risks} />
                  <SourceRoute path="/ancestry" exact component={AncestryPCA} />
                  <SourceRoute path="/chromosomepainting" exact component={ChromosomePainting} />
                </Switch>
              </Container>
            </main>
          </BrowserRouter>
        </SourceContext.Provider>
      </SettingsContext.Provider>
    );
  }
}

MySeq.propTypes = {
  settings: settingsPropType,
};

MySeq.defaultProps = {
  settings: {},
};

export default MySeq;
