/* eslint-disable no-unused-vars, max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table, Col, Row } from 'reactstrap';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from 'react-vis';
import { VCFSource } from 'myseq-vcf';
import every from 'lodash/every';
import orderBy from 'lodash/orderBy';
import { PubMed, ExternalLink } from '../util/links';

import {
  withSourceAndSettings,
  settingsPropType
} from '../../contexts/context-helpers';
import SettingsAlert from '../analyses/SettingsAlert';
import ReferenceAlert from '../analyses/ReferenceAlert';
import { refAwareVariantQuery } from '../util/query';
import '../../../node_modules/react-vis/dist/style.css';

// AIMs from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3073397/
const paintingVariants = [
  {
    ctg: '1',
    pos: 27931698,
    pos_hg38: 27605187,
    ref: 'G',
    alt: 'A',
    rsId: 'rs4908343',
    counted: 'A',
    EUR: 0.8289,
    AFR: 0.1708,
    EAS: 0.5736,
    LAT: 0.7608,
    AJE: 0.6656
  },
  {
    ctg: '1',
    pos: 101709563,
    pos_hg38: 101244007,
    ref: 'T',
    alt: 'C',
    rsId: 'rs3737576',
    counted: 'C',
    EUR: 0.05325,
    AFR: 0.01823,
    EAS: 0.09063,
    LAT: 0.2993,
    AJE: 0.03974
  },
  {
    ctg: '1',
    pos: 151122489,
    pos_hg38: 151150013,
    ref: 'C',
    alt: 'T',
    rsId: 'rs7554936',
    counted: 'T',
    EUR: 0.6544,
    AFR: 0.1309,
    EAS: 0.8544,
    LAT: 0.7029,
    AJE: 0.6954
  },
  {
    ctg: '2',
    pos: 109579738,
    pos_hg38: 108963282,
    ref: 'C',
    alt: 'A',
    rsId: 'rs260690',
    counted: 'A',
    EUR: 0.9262,
    AFR: 0.445,
    EAS: 0.05266,
    LAT: 0.5179,
    AJE: 0.9007
  },
  {
    ctg: '3',
    pos: 79399575,
    pos_hg38: 79350425,
    ref: 'T',
    alt: 'C',
    rsId: 'rs6548616',
    counted: 'C',
    EUR: 0.2682,
    AFR: 0.8301,
    EAS: 0.1724,
    LAT: 0.226,
    AJE: 0.404
  },
  {
    ctg: '3',
    pos: 135914476,
    pos_hg38: 136195634,
    ref: 'G',
    alt: 'A',
    rsId: 'rs9845457',
    counted: 'A',
    EUR: 0.6227,
    AFR: 0.1318,
    EAS: 0.8274,
    LAT: 0.711,
    AJE: 0.5364
  },
  {
    ctg: '4',
    pos: 41554364,
    pos_hg38: 41552347,
    ref: 'G',
    alt: 'A',
    rsId: 'rs10007810',
    counted: 'A',
    EUR: 0.2125,
    AFR: 0.8441,
    EAS: 0.1042,
    LAT: 0.2225,
    AJE: 0.2185
  },
  {
    ctg: '4',
    pos: 105375423,
    pos_hg38: 104454266,
    ref: 'T',
    alt: 'G',
    rsId: 'rs7657799',
    counted: 'G',
    EUR: 0.02198,
    AFR: 0.6941,
    EAS: 0.1753,
    LAT: 0.05967,
    AJE: 0.0596
  },
  {
    ctg: '5',
    pos: 6845035,
    pos_hg38: 6844922,
    ref: 'A',
    alt: 'C',
    rsId: 'rs870347',
    counted: 'C',
    EUR: 0.06512,
    AFR: 0.07785,
    EAS: 0.4975,
    LAT: 0.3819,
    AJE: 0.08667
  },
  {
    ctg: '5',
    pos: 43711378,
    pos_hg38: 43711276,
    ref: 'G',
    alt: 'A',
    rsId: 'rs6451722',
    counted: 'A',
    EUR: 0.2061,
    AFR: 0.7797,
    EAS: 0.2553,
    LAT: 0.1619,
    AJE: 0.2517
  },
  {
    ctg: '5',
    pos: 177863083,
    pos_hg38: 178436082,
    ref: 'T',
    alt: 'C',
    rsId: 'rs6422347',
    counted: 'C',
    EUR: 0.06807,
    AFR: 0.7467,
    EAS: 0.381,
    LAT: 0.1211,
    AJE: 0.1788
  },
  {
    ctg: '6',
    pos: 4747159,
    pos_hg38: 4746925,
    ref: 'G',
    alt: 'A',
    rsId: 'rs1040045',
    counted: 'A',
    EUR: 0.7447,
    AFR: 0.253,
    EAS: 0.9257,
    LAT: 0.8301,
    AJE: 0.7682
  },
  {
    ctg: '7',
    pos: 130742066,
    pos_hg38: 131057307,
    ref: 'A',
    alt: 'G',
    rsId: 'rs7803075',
    counted: 'G',
    EUR: 0.7179,
    AFR: 0.1304,
    EAS: 0.1227,
    LAT: 0.3962,
    AJE: 0.6689
  },
  {
    ctg: '8',
    pos: 4190793,
    pos_hg38: 4333271,
    ref: 'C',
    alt: 'A',
    rsId: 'rs10108270',
    counted: 'A',
    EUR: 0.2857,
    AFR: 0.8251,
    EAS: 0.3116,
    LAT: 0.2074,
    AJE: 0.2715
  },
  {
    ctg: '12',
    pos: 11701488,
    pos_hg38: 11548554,
    ref: 'A',
    alt: 'G',
    rsId: 'rs2416791',
    counted: 'G',
    EUR: 0.9522,
    AFR: 0.1877,
    EAS: 0.711,
    LAT: 0.6466,
    AJE: 0.9238
  },
  {
    ctg: '12',
    pos: 56163734,
    pos_hg38: 55769950,
    ref: 'G',
    alt: 'A',
    rsId: 'rs772262',
    counted: 'A',
    EUR: 0.06975,
    AFR: 0.7152,
    EAS: 0.1654,
    LAT: 0.3525,
    AJE: 0.1225
  },
  {
    ctg: '13',
    pos: 27624356,
    pos_hg38: 27050219,
    ref: 'T',
    alt: 'C',
    rsId: 'rs9319336',
    counted: 'C',
    EUR: 0.06158,
    AFR: 0.1325,
    EAS: 0.691,
    LAT: 0.3894,
    AJE: 0.04967
  },
  {
    ctg: '13',
    pos: 34847737,
    pos_hg38: 34273600,
    ref: 'C',
    alt: 'T',
    rsId: 'rs7997709',
    counted: 'T',
    EUR: 0.953,
    AFR: 0.7885,
    EAS: 0.3154,
    LAT: 0.5755,
    AJE: 0.8377
  },
  {
    ctg: '13',
    pos: 75993887,
    pos_hg38: 75419751,
    ref: 'T',
    alt: 'C',
    rsId: 'rs9530435',
    counted: 'C',
    EUR: 0.8364,
    AFR: 0.234,
    EAS: 0.9784,
    LAT: 0.8525,
    AJE: 0.7781
  },
  {
    ctg: '13',
    pos: 111827167,
    pos_hg38: 111174820,
    ref: 'T',
    alt: 'C',
    rsId: 'rs9522149',
    counted: 'C',
    EUR: 0.75,
    AFR: 0.1494,
    EAS: 0.006799,
    LAT: 0.3993,
    AJE: 0.7351
  },
  {
    ctg: '14',
    pos: 105679055,
    pos_hg38: 105212718,
    ref: 'A',
    alt: 'G',
    rsId: 'rs3784230',
    counted: 'G',
    EUR: 0.4197,
    AFR: 0.8719,
    EAS: 0.06967,
    LAT: 0.4439,
    AJE: 0.2781
  },
  {
    ctg: '17',
    pos: 62987151,
    pos_hg38: 64991033,
    ref: 'C',
    alt: 'T',
    rsId: 'rs11652805',
    counted: 'T',
    EUR: 0.8332,
    AFR: 0.1734,
    EAS: 0.7628,
    LAT: 0.7768,
    AJE: 0.7881
  }
];

const Legend = styled(Table)`
  td,
  th {
    padding: 0.3rem;
  }
  tbody + tbody,
  td,
  th,
  thead th {
    border: 0;
  }
`;

const popColors = {
  EUR: 'EF5D28',
  AFR: 'FF9833',
  EAS: '1A3177',
  LAT: '79C7E3',
  AJE: '12939A'
};
const popLabels = {
  EUR: 'European',
  AFR: 'African',
  EAS: 'East Asian',
  LAT: 'Latino',
  AJE: 'Ashkenazi Jewish'
};

class ChromosomePainting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alleleCount: [],
      showSettingsAlert: false,
      showReferenceAlert: false
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;

    Promise.all(
      paintingVariants.map(query =>
        refAwareVariantQuery(this.props.source, query, assumeRefRef)
      )
    )
      .then(variants => {
        const alleleCount = variants.map((variant, idx) => {
          if (!variant) {
            return undefined;
          }
          const countMatches = variant
            .genotype(sample)
            .match(new RegExp(paintingVariants[idx].counted, 'g'));
          return countMatches ? countMatches.length : 0;
        });
        this.setState({ alleleCount });

        if (!assumeRefRef && !every(variants)) {
          this.setState({ showSettingsAlert: true });
        }
      })
      .catch(() => {
        // TODO: Differentiate error types
        this.setState({ showReferenceAlert: true });
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  render() {
    const { settings } = this.props;
    const { alleleCount, showSettingsAlert, showReferenceAlert } = this.state;

    const probPosterior = {
      EUR: 0.2,
      AFR: 0.2,
      EAS: 0.2,
      LAT: 0.2,
      AJE: 0.2
    };

    alleleCount.forEach((ac, idx) => {
      const variant = paintingVariants[idx];
      Object.keys(probPosterior).forEach(pop => {
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
    Object.keys(probPosterior).forEach(pop => {
      probPosterior[pop] /= probGT;
    });
    const plotData = orderBy(
      Object.entries(probPosterior).map(([pop, prob]) => ({
        x: 'Sample',
        y: prob * 100,
        color: popColors[pop]
      })),
      ['y'],
      ['desc']
    );
    return (
      <div>
        <ReferenceAlert isOpen={showReferenceAlert} />
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        <Row>
          <Col md="auto">
            <XYPlot width={300} height={400} xType="ordinal" stackBy="y">
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis title="Probability of Ancestry (%)" position="middle" />
              <VerticalBarSeries data={plotData} colorType="literal" />
            </XYPlot>
          </Col>
          <Col md={3}>
            <Legend>
              <thead>
                <tr>
                  <th colSpan="2">Populations</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(probPosterior).map(([pop, prob]) => (
                  <tr key={pop}>
                    <td>
                      <svg width="15" height="15">
                        <rect
                          width="15"
                          height="15"
                          style={{ fill: popColors[pop] }}
                        />
                      </svg>
                    </td>
                    <td>
                      {popLabels[pop]} (
                      {prob.toLocaleString(undefined, { style: 'percent' })})
                    </td>
                  </tr>
                ))}
              </tbody>
            </Legend>
          </Col>
          <Col md={5}>
            <p>
              Ancestry probabilities computed assuming a Bayesian model using a
              set of {alleleCount.length} ancestry-informative markers (AIM)
              from <PubMed pubmedId={18683858} /> and allele frequency data from{' '}
              <ExternalLink href="http://gnomad.broadinstitute.org/">
                gnomAD
              </ExternalLink>
              .
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

ChromosomePainting.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired
};

export default withSourceAndSettings(ChromosomePainting);
