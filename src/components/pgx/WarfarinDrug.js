/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import classNames from 'classnames';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from '../analyses/SettingsAlert';
import ReferenceAlert from '../analyses/ReferenceAlert';
import { PharmGKB, PubMed, ExternalLink } from '../util/links';
import { flipStrand } from '../util/alleles';
import { refAwareVariantQuery } from '../util/query';

const warfarinFDA = {
  title: 'Warfarin FDA Label',
  variants: [
    {
      ctg: '16', pos: 31107689, pos_hg38: 3109636, ref: 'C', alt: 'T', flip: true,
    }, // VKORC1 (flip to be consistent with external tables, etc.)
    {
      ctg: '10', pos: 96702047, pos_hg38: 94942290, ref: 'C', alt: 'T',
    }, // CYP2C9 *2
    {
      ctg: '10', pos: 96741053, pos_hg38: 94981296, ref: 'A', alt: 'C',
    }, // CYP2C9 *3
  ],
  rsId: ['rs9923231', 'rs1799853', 'rs1057910'],
  starName: ['CYP2C9 *1/*1', 'CYP2C9 *1/*2', 'CYP2C9 *1/*3', 'CYP2C9 *2/*2', 'CYP2C9 *2/*3', 'CYP2C9 *3/*3'],
  association: [
    {
      vkorcGenotype: 'G/G',
      cyp2c9Genotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['5-7', '5-7', '3-4', '3-4', '3-4', '0.5-2'],
    },
    {
      vkorcGenotype: 'G/A',
      cyp2c9Genotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['5-7', '3-4', '3-4', '3-4', '0.5-2', '0.5-2'],
    },
    {
      vkorcGenotype: 'A/A',
      cyp2c9Genotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['3-4', '3-4', '0.5-2', '0.5-2', '0.5-2', '0.5-2'],
    },
  ],
};

const warfarinAlg = {
  title: 'Warfarin Dosing Algorithm',
  variants: [
    {
      ctg: '16', pos: 31107689, pos_hg38: 31096368, ref: 'C', alt: 'T', flip: true,
    }, // VKORC1 (flip to be consistent with external tables, etc.)
    {
      ctg: '19', pos: 15990431, pos_hg38: 15879621, ref: 'C', alt: 'T',
    }, // CYP4F2
    {
      ctg: '2', pos: 85777633, pos_hg38: 85550510, ref: 'C', alt: 'G',
    }, // GGCX
    {
      ctg: '10', pos: 96702047, pos_hg38: 94942290, ref: 'C', alt: 'T',
    }, // CYP2C9 *2
    {
      ctg: '10', pos: 96741053, pos_hg38: 94981296, ref: 'A', alt: 'C',
    }, // CYP2C9 *3
    {
      ctg: '10', pos: 96741058, pos_hg38: 94981301, ref: 'C', alt: 'G',
    }, // CYP2C9 *5
    {
      ctg: '10', pos: 96709038, pos_hg38: 94949281, ref: 'GA', alt: 'G',
    }, // CYP2C9 *6

  ],
  rsId: ['rs9923231', 'rs2108622', ' rs11676382', 'rs1799853', 'rs1057910', 'rs28371686', 'rs9332131'],
  name: ['VKORC1-1639/3673', 'CYP4F2', 'GGCX', 'CYP2C9 *2', 'CYP2C9 *3', 'CYP2C9 *5', 'CYP2C9 *6'],
};

class WarfarinFDA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotypes: [],
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = warfarinFDA.variants;

    Promise.all(queries.map(query => refAwareVariantQuery(this.props.source, query, assumeRefRef)))
      .then((variants) => {
        this.setState({
          genotypes: variants.map((variant, idx) => {
            if (!variant) {
              return undefined;
            }
            const genotype = variant.genotype(sample);
            return queries[idx].flip ? flipStrand(genotype) : genotype;
          }),
        });

        if (!assumeRefRef && !every(variants)) {
          this.props.missingGenotype();
        }
      })
      .catch(() => {
        // TODO: Differentiate error types
        this.props.referenceError();
      });
  }

  render() {
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>VKORC1-1639</th>
            { warfarinFDA.starName.map(name => (<th key={name}>{name}</th>)) }
          </tr>
        </thead>
        <tbody>
          {warfarinFDA.association.map((assoc) => {
            const genotypes = assoc.cyp2c9Genotype.map(cyp2c9Genotype =>
              [assoc.vkorcGenotype].concat(cyp2c9Genotype));
            return (
              <tr key={assoc.genotypes}>
                <td>{flipStrand(assoc.vkorcGenotype)}</td>
                { assoc.phenotype.map((phenotype, index) => (
                  <td
                    className={classNames({ 'table-primary': isEqual(genotypes[index], this.state.genotypes) })}
                  >
                    {phenotype}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

WarfarinFDA.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  missingGenotype: PropTypes.func.isRequired,
  referenceError: PropTypes.func.isRequired,
};

class WarfarinAlg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotypes: [],
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = warfarinAlg.variants;

    Promise.all(queries.map(query => refAwareVariantQuery(this.props.source, query, assumeRefRef)))
      .then((variants) => {
        this.setState({
          genotypes: variants.map((variant, idx) => {
            if (!variant) {
              return undefined;
            }
            const genotype = variant.genotype(sample);
            return queries[idx].flip ? flipStrand(genotype) : genotype;
          }),
        });

        if (!assumeRefRef && !every(variants)) {
          this.props.missingGenotype();
        }
      }).catch(() => {
        // TODO: Differentiate error types
        this.props.referenceError();
      });
  }

  render() {
    return (
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>Variant</th>
            <th>Genotype</th>
          </tr>
        </thead>
        <tbody>
          { warfarinAlg.name.map((name, index) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{this.state.genotypes[index]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

WarfarinAlg.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  missingGenotype: PropTypes.func.isRequired,
  referenceError: PropTypes.func.isRequired,
};

class WarfarinDrug extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettingsAlert: false,
      showReferenceAlert: false,
    };

    this.handleMissingGenotype = this.handleMissingGenotype.bind(this);
    this.handleReferenceError = this.handleReferenceError.bind(this);
  }

  handleMissingGenotype() {
    this.setState({ showSettingsAlert: true });
  }

  handleReferenceError() {
    this.setState({ showReferenceAlert: true });
  }

  render() {
    return (
      <div>
        <h3>Warfarin</h3>
        <ReferenceAlert isOpen={this.state.showReferenceAlert} />
        <SettingsAlert
          isOpen={this.state.showSettingsAlert && !this.props.settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        <p>
          Warfarin is a widely used anticoagulant therapy with a narrow therapeutic range and large variability in the dose required for a patient to achieve the target anticoagulation. The <PubMed pubmedId={28198005}>CPIC Guidelines</PubMed> provides a multi-tier set of guidelines (implemented as a decision-tree). These analyses reproduce the dosage table from the FDA label and extract the genotypes needed by the <ExternalLink href="http://warfarindosing.org">WarfarinDosing.org</ExternalLink> genetics-based dosing algorithm.
        </p>
        <h4>Warfarin FDA Label</h4>
        <Row>
          <Col md={8}>
            <WarfarinFDA
              source={this.props.source}
              settings={this.props.settings}
              missingGenotype={this.handleMissingGenotype}
              referenceError={this.handleReferenceError}
            />
          </Col>
          <Col md={4}>
            <p>
              FDA suggested daily Warfarin dosage (in mg/day) in order to achieve an optimal theraputic effect. Adapted from <PharmGKB PAid="PA451906" PAidGuide="PA166104949" />.
            </p>
          </Col>
        </Row>
        <h4>Warfarin Dosing Algorithm</h4>
        <Row>
          <Col md={6}>
            <WarfarinAlg
              source={this.props.source}
              settings={this.props.settings}
              missingGenotype={this.handleMissingGenotype}
              referenceError={this.handleReferenceError}
            />
          </Col>
          <Col md={6}>
            <p>
              These genotypes, along with other clinical variables, are utilized by the <ExternalLink href="http://warfarindosing.org">WarfarinDosing.org</ExternalLink> dosing algorithm.
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

WarfarinDrug.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
};

export default withSourceAndSettings(WarfarinDrug);
