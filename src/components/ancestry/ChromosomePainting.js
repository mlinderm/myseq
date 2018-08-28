/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, Col, Row, Input, Form, FormGroup, Label } from 'reactstrap';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from 'react-vis';
import { BeatLoader } from 'react-spinners';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { PubMed, ExternalLink } from '../util/links';

import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from '../analyses/SettingsAlert';
import '../../../node_modules/react-vis/dist/style.css';

// AIMs from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3073397/
const paintingVariants = [
  {
    ctg: '1', pos: 27931698, ref: 'G', alt: 'A', rsId: 'rs4908343', counted: 'A', EUR: 0.8289, AFR: 0.1708, EAS: 0.5736, LAT: 0.7608, AJE: 0.6656,
  },
  {
    ctg: '1', pos: 101709563, ref: 'T', alt: 'C', rsId: 'rs3737576', counted: 'C', EUR: 0.05325, AFR: 0.01823, EAS: 0.09063, LAT: 0.2993, AJE: 0.03974,
  },
  {
    ctg: '1', pos: 151122489, ref: 'C', alt: 'T', rsId: 'rs7554936', counted: 'T', EUR: 0.6544, AFR: 0.1309, EAS: 0.8544, LAT: 0.7029, AJE: 0.6954,
  },
  {
    ctg: '2', pos: 109579738, ref: 'C', alt: 'A', rsId: 'rs260690', counted: 'A', EUR: 0.9262, AFR: 0.4450, EAS: 0.05266, LAT: 0.5179, AJE: 0.9007,
  },
  {
    ctg: '3', pos: 79399575, ref: 'T', alt: 'C', rsId: 'rs6548616', counted: 'C', EUR: 0.2682, AFR: 0.8301, EAS: 0.1724, LAT: 0.2260, AJE: 0.4040,
  },
  {
    ctg: '3', pos: 135914476, ref: 'G', alt: 'A', rsId: 'rs9845457', counted: 'A', EUR: 0.6227, AFR: 0.1318, EAS: 0.8274, LAT: 0.7110, AJE: 0.5364,
  },
  {
    ctg: '4', pos: 41554364, ref: 'G', alt: 'A', rsId: 'rs10007810', counted: 'A', EUR: 0.2125, AFR: 0.8441, EAS: 0.1042, LAT: 0.2225, AJE: 0.2185,
  },
  {
    ctg: '4', pos: 105375423, ref: 'T', alt: 'G', rsId: 'rs7657799', counted: 'G', EUR: 0.02198, AFR: 0.6941, EAS: 0.1753, LAT: 0.05967, AJE: 0.05960,
  },
  {
    ctg: '5', pos: 6845035, ref: 'A', alt: 'C', rsId: 'rs870347', counted: 'C', EUR: 0.06512, AFR: 0.07785, EAS: 0.4975, LAT: 0.3819, AJE: 0.08667,
  },
  {
    ctg: '5', pos: 43711378, ref: 'G', alt: 'A', rsId: 'rs6451722', counted: 'A', EUR: 0.2061, AFR: 0.7797, EAS: 0.2553, LAT: 0.1619, AJE: 0.2517,
  },
  {
    ctg: '5', pos: 177863083, ref: 'T', alt: 'C', rsId: 'rs6422347', counted: 'C', EUR: 0.06807, AFR: 0.7467, EAS: 0.3810, LAT: 0.1211, AJE: 0.1788,
  },
  {
    ctg: '6', pos: 4747159, ref: 'G', alt: 'A', rsId: 'rs1040045', counted: 'A', EUR: 0.7447, AFR: 0.2530, EAS: 0.9257, LAT: 0.8301, AJE: 0.7682,
  },
  {
    ctg: '7', pos: 130742066, ref: 'A', alt: 'G', rsId: 'rs7803075', counted: 'G', EUR: 0.7179, AFR: 0.1304, EAS: 0.1227, LAT: 0.3962, AJE: 0.6689,
  },
  {
    ctg: '8', pos: 4190793, ref: 'C', alt: 'A', rsId: 'rs10108270', counted: 'A', EUR: 0.2857, AFR: 0.8251, EAS: 0.3116, LAT: 0.2074, AJE: 0.2715,
  },
  {
    ctg: '12', pos: 11701488, ref: 'A', alt: 'G', rsId: 'rs2416791', counted: 'G', EUR: 0.9522, AFR: 0.1877, EAS: 0.7110, LAT: 0.6466, AJE: 0.9238,
  },
  {
    ctg: '12', pos: 56163734, ref: 'G', alt: 'A', rsId: 'rs772262', counted: 'A', EUR: 0.06975, AFR: 0.7152, EAS: 0.1654, LAT: 0.3525, AJE: 0.1225,
  },
  {
    ctg: '13', pos: 27624356, ref: 'T', alt: 'C', rsId: 'rs9319336', counted: 'C', EUR: 0.06158, AFR: 0.1325, EAS: 0.6910, LAT: 0.3894, AJE: 0.04967,
  },
  {
    ctg: '13', pos: 34847737, ref: 'C', alt: 'T', rsId: 'rs7997709', counted: 'T', EUR: 0.9530, AFR: 0.7885, EAS: 0.3154, LAT: 0.5755, AJE: 0.8377,
  },
  {
    ctg: '13', pos: 75993887, ref: 'T', alt: 'C', rsId: 'rs9530435', counted: 'C', EUR: 0.8364, AFR: 0.2340, EAS: 0.9784, LAT: 0.8525, AJE: 0.7781,
  },
  {
    ctg: '13', pos: 111827167, ref: 'T', alt: 'C', rsId: 'rs9522149', counted: 'C', EUR: 0.7500, AFR: 0.1494, EAS: 0.006799, LAT: 0.3993, AJE: 0.7351,
  },
  {
    ctg: '14', pos: 105679055, ref: 'A', alt: 'G', rsId: 'rs3784230', counted: 'G', EUR: 0.4197, AFR: 0.8719, EAS: 0.06967, LAT: 0.4439, AJE: 0.2781,
  },
  {
    ctg: '17', pos: 62987151, ref: 'C', alt: 'T', rsId: 'rs11652805', counted: 'T', EUR: 0.8332, AFR: 0.1734, EAS: 0.7628, LAT: 0.7768, AJE: 0.7881,
  },
];

const Legend = styled(Table)`
  td, th {
    padding: .3rem;
  }
  tbody+tbody, td, th, thead th {
    border: 0;
  }
`;

const popColors = {
  EUR: 'EF5D28', AFR: 'FF9833', EAS: '1A3177', LAT: '79C7E3', AJE: '12939A',
};
const popLabels = {
  EUR: 'European', AFR: 'African', EAS: 'East Asian', LAT: 'Latino', AJE: 'Ashkenazi Jewish',
};

class ChromosomePainting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;

    Promise.all(paintingVariants.map(query => this.props.source.variant(
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
          const countMatches = variant.genotype(sample).match(new RegExp(paintingVariants[idx].counted, 'g'));
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

    const probPosterior = {
      EUR: 0.20, AFR: 0.20, EAS: 0.20, LAT: 0.20, AJE: 0.20,
    };

    alleleCount.forEach((ac, idx) => {
      const variant = paintingVariants[idx];
      Object.keys(probPosterior).forEach((pop) => {
        const freq = variant[pop];
        let GTgivenPop;
        if (ac === 2) {
          GTgivenPop = freq * freq;
        } else if (ac === 1) {
          GTgivenPop = 2 * freq * (1 - freq);
        } else if (ac === 0) {
          GTgivenPop = (1 - freq) * (1 - freq);
        }
        probPosterior[pop] *= GTgivenPop;
      });
    });
    const probGT = Object.values(probPosterior).reduce((a, b) => a + b);
    Object.keys(probPosterior).forEach((pop) => {
      probPosterior[pop] /= probGT;
    });
    const plotData = orderBy(Object.entries(probPosterior).map(([pop, prob]) => (
      { x: 'Sample', y: prob * 100, color: popColors[pop] }
    )), ['y'], ['desc']);
    return (
      <div>
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={this.handleAlertDismiss}
        />
        <Row>
          <Col md={4}>
            <FlexibleWidthXYPlot height={400} xType="ordinal" stackBy="y">
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis title="Probability of Ancestry (%)" position="middle" />
              <VerticalBarSeries data={plotData} colorType="literal" />
            </FlexibleWidthXYPlot>
          </Col>
          <Col md={3}>
            <Legend>
              <thead>
                <tr><th colSpan="2">Populations</th></tr>
              </thead>
              <tbody>
                { Object.entries(probPosterior).map(([pop, prob]) => (
                  <tr key={pop}>
                    <td>
                      <svg width="15" height="15">
                        <rect width="15" height="15" style={{ fill: popColors[pop] }} />
                      </svg>
                    </td>
                    <td>{popLabels[pop]} ({prob.toLocaleString(undefined, { style: 'percent' })})</td>
                  </tr>
                )) }
              </tbody>
            </Legend>
          </Col>
          <Col md={5}>
            <p>Ancestry probabilities computed assuming a Bayesian model using a set of {alleleCount.length} ancestry-informative markers (AIM) from <PubMed pubmedId={18683858} /> and allele frequency data from <ExternalLink href="http://gnomad.broadinstitute.org/">gnomAD</ExternalLink>.</p>
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
