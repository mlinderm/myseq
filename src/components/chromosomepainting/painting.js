/* eslint-disable no-unused-vars */
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
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
} from 'react-vis';
import { BeatLoader } from 'react-spinners';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import get from 'lodash/get';

import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from '../analyses/SettingsAlert';
import '../../../node_modules/react-vis/dist/style.css';
import paintingVariants from './sample_data.json';

const Legend = styled(Table)`
  td, th {
    padding: .3rem;
  }
  tbody+tbody, td, th, thead th {
    border: 0;
  }
`;

class ChromosomePainting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    // this.handleBackgroundChange = this.handleBackgroundChange.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = paintingVariants;

    Promise.all(queries.map(query => this.props.source.variant(
      query.ctg,
      query.pos,
      query.ref,
      query.alt,
      assumeRefRef,
    )))
      .then((variants) => {
        const alleleCount = variants.map((variant, idx) => {
          if (!variant) {
            return undefined;
          }
          const countMatches = variant.genotype(sample).match(new RegExp(queries[idx].counted, 'g'));
          return countMatches ? countMatches.length : 0;
        });
        this.setState({ alleleCount });

        if (!assumeRefRef && !every(variants)) {
          this.setState({ showSettingsAlert: true });
        }
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  render() {
    const { settings } = this.props;
    const {
      alleleCount,
      showSettingsAlert,
    } = this.state;

    const pgt = {
      EUR: 0.16, AFR: 0.16, EAS: 0.16, LAT: 0.16, AJE: 0.16, OTH: 0.16,
    };
    const pgtColors = ['EF5D28', 'FF9833', '1A3177', '79C7E3', '12939A', 'F78860'];
    const alleleCountSample = [0, 1, 0, 1];

    alleleCount.forEach((ac, idx) => {
      const variant = paintingVariants[idx];
      ['EUR', 'AFR', 'EAS', 'LAT', 'AJE', 'OTH'].forEach((pop) => {
        const freq = variant[pop];
        let GTgivenPop;
        if (ac === 2) {
          GTgivenPop = freq * freq;
        } else if (ac === 1) {
          GTgivenPop = 2 * freq * (1 - freq);
        } else if (ac === 0) {
          GTgivenPop = (1 - freq) * (1 - freq);
        }
        pgt[pop] *= GTgivenPop;
      });
    });
    const PrGT = pgt.EUR + pgt.AFR + pgt.EAS + pgt.LAT + pgt.AJE + pgt.OTH;
    pgt.EUR /= PrGT;
    pgt.AFR /= PrGT;
    pgt.EAS /= PrGT;
    pgt.LAT /= PrGT;
    pgt.AJE /= PrGT;
    pgt.OTH /= PrGT;

    return (
      <div>
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={this.handleAlertDismiss}
        />
        <Row>
          <Col md={6}>
            <XYPlot
              width={400}
              height={400}
              stackBy="y"
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis title="Percentage (%)" position="middle" />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.EUR * 100 },
                ]}
                color="EF5D28"
              />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.AFR * 100 },
                ]}
                color="FF9833"
              />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.EAS * 100 },
                ]}
                color="1A3177"
              />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.LAT * 100 },
                ]}
                color="79C7E3"
              />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.AJE * 100 },
                ]}
                color="12939A"
              />
              <VerticalBarSeries
                data={[
                  { x: 1, y: pgt.OTH * 100 },
                ]}
                color="F78860"
              />
            </XYPlot>
          </Col>
          <Col md={3}>
            <Legend>
              <thead>
                <tr><th colSpan="2">Populations</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: 'EF5D28' }}
                      />
                    </svg>
                  </td>
                  <td>EUR</td>
                  <td>{pgt.EUR * 100}</td>
                </tr>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: 'FF9833' }}
                      />
                    </svg>
                  </td>
                  <td>AFR</td>
                  <td>{pgt.AFR * 100}</td>
                </tr>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: '1A3177' }}
                      />
                    </svg>
                  </td>
                  <td>EAS</td>
                  <td>{pgt.EAS * 100}</td>
                </tr>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: '79C7E3' }}
                      />
                    </svg>
                  </td>
                  <td>LAT</td>
                  <td>{pgt.LAT * 100}</td>
                </tr>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: '12939A' }}
                      />
                    </svg>
                  </td>
                  <td>AJE</td>
                  <td>{pgt.AJE * 100}</td>
                </tr>
                <tr>
                  <td>
                    <svg width="15" height="15">
                      <rect
                        width="15"
                        height="15"
                        style={{ fill: 'F78860' }}
                      />
                    </svg>
                  </td>
                  <td>OTH</td>
                  <td>{pgt.OTH * 100}</td>
                </tr>
              </tbody>
            </Legend>
          </Col>
        </Row>
      </div>
    );
  }
}

ChromosomePainting.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
};

export default withSourceAndSettings(ChromosomePainting);
