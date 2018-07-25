import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  DiscreteColorLegend,
  CustomSVGSeries,
  PolygonSeries,
} from 'react-vis';
import { BeatLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import styled from 'styled-components';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from './SettingsAlert';
import '../../../node_modules/react-vis/dist/style.css';
import queryVariants from './popres-drineasetal.clean.json';

const Legend = styled.div`
  position: absolute;
  text-align: left;
  right: 0;
`;

const Chart = styled.div`
  margin-right: 150;
`;

const legendItems = [
  'European',
  'African American',
  'Latino',
  'South Asian',
  'East Asian',
];

const euroPoints = [
  {
    x: 3.914939, y: 2.138966,
  },
  // { // outlier
  //   x: 2.507552, y: 5.697582,
  // },
  {
    x: -3.017748, y: 3.426239,
  },
  {
    x: -3.805820, y: 2.890690,
  },
  {
    x: -5.645789, y: 0.806481,
  },
  {
    x: -5.864868, y: -2.668472,
  },
  {
    x: -4.33224, y: -3.743894,
  },
  {
    x: -2.962506, y: -4.525817,
  },
  {
    x: -0.689538, y: -4.395281,
  },
  // { // outlier
  //   x: -0.154069, y: 4.104127,
  // },
  {
    x: 2.994920, y: -1.918013,
  },
];
const afamPoints = [
  {
    x: -1.033673, y: 0.646794,
  },
  // { // outlier
  //   x: -3.851730, y: -1.461758,
  // },
  // { // outlier
  //   x: -3.061801, y: -2.263425,
  // },
  {
    x: 10.774242, y: -5.906333,
  },
  {
    x: 13.121441, y: -5.619658,
  },
  {
    x: 14.468734, y: -5.250108,
  },
  {
    x: 16.904555, y: -4.010556,
  },
  {
    x: 16.347028, y: -3.217133,
  },
  {
    x: 12.557934, y: 0.316651,
  },
  {
    x: 8.041965, y: 1.601434,
  },
  {
    x: 4.042408, y: 2.480701,
  },
];
const latinoPoints = [
  {
    x: 4.610013, y: 4.257636,
  },
  {
    x: 2.146355, y: 8.667928,
  },
  {
    x: -0.169206, y: 6.742267,
  },
  {
    x: -1.269717, y: 5.164818,
  },
  {
    x: -2.393896, y: 1.107841,
  },
  {
    x: 1.365500, y: -0.278531,
  },
];
const southasPoints = [
  // { // outlier
  //   x: -1.827819, y: 3.050334,
  // },
  // { // outlier
  //   x: -1.076747, y: -1.239178,
  // },
  {
    x: 4.932366, y: 3.124910,
  },
  {
    x: 4.948124, y: 8.226731,
  },
  {
    x: 3.468338, y: 8.931658,
  },
  {
    x: 0.598147, y: 7.783064,
  },
  {
    x: 0.049454, y: 7.175774,
  },
  {
    x: -0.336803, y: 6.720488,
  },
  {
    x: -1.353051, y: 5.275963,
  },
];
const eastasPoints = [
  {
    x: 6.935497, y: 9.871727,
  },
  {
    x: 5.845939, y: 11.586370,
  },
  {
    x: 5.144031, y: 11.682549,
  },
  {
    x: 3.857850, y: 11.108422,
  },
  {
    x: 2.881433, y: 10.591011,
  },
  {
    x: 3.714674, y: 8.391783,
  },
  {
    x: 5.556027, y: 7.919534,
  },
  {
    x: 6.203472, y: 8.120435,
  },
];

class AncestryPCA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
      isLoading: true,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = queryVariants;

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
        this.setState({ alleleCount, isLoading: false });

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
      isLoading,
    } = this.state;

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
    let myData = [];
    if (PC1 && PC2) {
      myData = [{
        x: PC1, y: PC2, size: 10, style: { fill: '4c4c4c' },
      }];
    }

    return (
      <div>
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={this.handleAlertDismiss}
        />
        <Row>
          <Col md={6}>
            <Legend>
              <DiscreteColorLegend
                height={200}
                width={150}
                items={legendItems}
              />
            </Legend>
            <Chart>
              <XYPlot width={300} height={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title="PC1" position="end" />
                <YAxis title="PC2" position="end" />
                <PolygonSeries
                  className="European"
                  data={euroPoints}
                  style={{
                      fill: '12939A',
                      stroke: '12939A',
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
                <PolygonSeries
                  className="African American"
                  data={afamPoints}
                  style={{
                      fill: '79C7E3',
                      stroke: '79C7E3',
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
                <PolygonSeries
                  className="Latino"
                  data={latinoPoints}
                  style={{
                      fill: '1A3177',
                      stroke: '1A3177',
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
                <PolygonSeries
                  className="South Asian"
                  data={southasPoints}
                  style={{
                      fill: 'FF9833',
                      stroke: 'FF9833',
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
                <PolygonSeries
                  className="East Asian"
                  data={eastasPoints}
                  style={{
                      fill: 'EF5D28',
                      stroke: 'EF5D28',
                      strokeWidth: 1.5,
                      fillOpacity: 0.5,
                      strokeOpacity: 0.7,
                    }}
                />
                <CustomSVGSeries customComponent="diamond" data={myData} />
              </XYPlot>
            </Chart>
          </Col>
        </Row>
        <BeatLoader color="#11bc64" loading={isLoading} />
        {(isLoading) && (
          <p>
            Computing coordinates...
          </p>
        )}
      </div>
    );
  }
}

AncestryPCA.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
};

export default withSourceAndSettings(AncestryPCA);
