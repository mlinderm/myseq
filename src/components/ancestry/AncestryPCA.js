/* eslint-disable no-unused-vars, max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, Col, Row, Input, Form, FormGroup, Label } from 'reactstrap';
import {
  FlexibleXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  PolygonSeries,
  MarkSeries,
} from 'react-vis';
import { BeatLoader } from 'react-spinners';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import get from 'lodash/get';

import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from '../analyses/SettingsAlert';
import ReferenceAlert from '../analyses/ReferenceAlert';
import { refAwareVariantQuery } from '../util/query';
import '../../../node_modules/react-vis/dist/style.css';
import queryVariants from './popres-drineasetal.clean.json';
import { continentalView, europeanView, southAsianView } from './AncestryPCABackgrounds';

const Legend = styled(Table)`
  td, th {
    padding: .3rem;
  }
  tbody+tbody, td, th, thead th {
    border: 0;
  }
`;

const InlineLoader = styled(BeatLoader)`
  display: inline-block;
`;

const backgroundMap = {
  continental: continentalView,
  european: europeanView,
  southasian: southAsianView,
};

class AncestryPCA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
      showReferenceAlert: false,
      isLoading: true,
      backgroundPops: 'continental',
    };

    this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;

    Promise.all(queryVariants.map(query => refAwareVariantQuery(this.props.source, query, assumeRefRef)))
      .then((variants) => {
        const alleleCount = variants.map((variant, idx) => {
          if (!variant) {
            return undefined;
          }
          const countMatches = variant.genotype(sample).match(new RegExp(queryVariants[idx].counted, 'g'));
          return countMatches ? countMatches.length : 0;
        });
        this.setState({ alleleCount, isLoading: false });

        if (!assumeRefRef && !every(variants)) {
          this.setState({ showSettingsAlert: true });
        }
      }).catch(() => {
        // TODO: Differentiate error types
        this.setState({ showReferenceAlert: true, isLoading: false });
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  handleBackgroundChange(evt) {
    this.setState({ backgroundPops: evt.target.value });
  }

  computePCACoordinates() {
    const { alleleCount } = this.state;
    let PC1;
    let PC2;
    if (alleleCount.length === queryVariants.length) {
      PC1 = 0.0;
      PC2 = 0.0;
      alleleCount.forEach((ac, idx) => {
        const {
          avg,
          denom,
          PC1: coeff1,
          PC2: coeff2,
        } = queryVariants[idx];
        const normAC = ac ? (ac - avg) / denom : 0.0;
        PC1 += normAC * coeff1;
        PC2 += normAC * coeff2;
      });
    }
    return { PC1, PC2 };
  }

  render() {
    const { settings } = this.props;
    const {
      alleleCount,
      showSettingsAlert,
      showReferenceAlert,
      isLoading,
      backgroundPops,
    } = this.state;

    const { PC1, PC2 } = this.computePCACoordinates();

    let myData = [];
    if (PC1 !== undefined && PC2 !== undefined) {
      myData = [{ x: PC1, y: PC2 }];
    }

    // Select background view, defaulting to continental view
    const backgroundView = backgroundMap[backgroundPops] || continentalView;

    return (
      <div>
        <ReferenceAlert isOpen={showReferenceAlert} />
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        { (isLoading) && (
          <div>
            <span className="text-info" style={{ verticalAlign: 'top' }}>
              Loading genomic data and computing coordinates...{' '}
            </span>
            <InlineLoader color="#17a2b8" loading={isLoading} />
          </div>
        )}
        <Row>
          <Col md="auto">
            <XYPlot width={360} height={360}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title="PC1" position="end" />
              <YAxis title="PC2" position="end" />
              { backgroundView.map(country => (
                <PolygonSeries
                  key={country.className}
                  className={country.className}
                  data={country.data}
                  style={{
                      fill: country.fill,
                      stroke: country.fill,
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
              ))}
              <MarkSeries data={myData} size={5} color="4c4c4c" />
            </XYPlot>
          </Col>
          <Col md={3}>
            <Legend>
              <thead>
                <tr><th colSpan="2">Populations</th></tr>
              </thead>
              <tbody>
                { backgroundView.map(country => (
                  <tr key={country.className}>
                    <td>
                      <svg width="15" height="15">
                        <rect width="15" height="15" style={{ fill: country.fill }} />
                      </svg>
                    </td>
                    <td>{country.className}</td>
                  </tr>
                ))}
              </tbody>
            </Legend>
            <Form>
              <FormGroup>
                <Label for="backgroundView"><b>Background Population</b></Label>
                <Input id="backgroundView" type="select" bsSize="sm" value={backgroundPops} onChange={this.handleBackgroundChange}>
                  <option key="continental" value="continental">All Continents</option>
                  <option key="europe" value="european">European</option>
                  <option key="southasian" value="southasian">South Asian</option>
                </Input>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

AncestryPCA.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
};

export default withSourceAndSettings(AncestryPCA);
