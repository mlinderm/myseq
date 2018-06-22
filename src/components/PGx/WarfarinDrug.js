/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col, Alert } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import { PubMed, SNPedia, PharmGKB } from '../util/links';

const warfarinFDA = {
  title: 'Warfarin',
  variants: [
    {
      ctg: '16', pos: 31107689, ref: 'G', alt: 'A',
    }, // VKORC1
    {
      ctg: '10', pos: 96702047, ref: 'C', alt: 'T',
    }, // CYP2C9 *2
    {
      ctg: '10', pos: 96741053, ref: 'A', alt: 'C',
    }, // CYP2C9 *3
  ],
  rsId: ['rs9923231', 'rs1799853', 'rs1057910'],
  starName: ['CYP2C9 *1/*1', 'CYP2C9 *1/*2', 'CYP2C9 *1/*3', 'CYP2C9 *2/*2', 'CYP2C9 *2/*3', 'CYP2C9 *3/*3'],
  association: [
    {
      vkorcGenotype: 'G/G',
      cypGenotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['5-7', '5-7', '3-4', '3-4', '3-4', '0.5-2'],
    },
    {
      vkorcGenotype: 'G/A',
      cypGenotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['5-7', '3-4', '3-4', '3-4', '0.5-2', '0.5-2'],
    },
    {
      vkorcGenotype: 'A/A',
      cypGenotype: [['C/C', 'A/A'], ['C/T', 'A/A'], ['C/C', 'A/C'], ['T/T', 'A/A'], ['C/T', 'A/C'], ['C/C', 'C/C']],
      phenotype: ['3-4', '3-4', '0.5-2', '0.5-2', '0.5-2', '0.5-2'],
    },
  ],
};

const warfarinAlg = {
  title: 'Warfarin',
  variants: [
    {
      ctg: '16', pos: 31107689, ref: 'G', alt: 'A',
    }, // VKORC1
    {
      ctg: '19', pos: 15990431, ref: 'C', alt: 'T',
    }, // CYP4F2
    {
      ctg: '2', pos: 85777633, ref: 'C', alt: 'G',
    }, // GGCX
    {
      ctg: '10', pos: 96702047, ref: 'C', alt: 'T',
    }, // CYP2C9 *2
    {
      ctg: '10', pos: 96741053, ref: 'A', alt: 'C',
    }, // CYP2C9 *3
    {
      ctg: '10', pos: 96741058, ref: 'C', alt: 'G',
    }, // CYP2C9 *5
    {
      ctg: '10', pos: 96709040, ref: 'A', alt: '',
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

    Promise.all(queries.map(query => this.props.source.variant(
      query.ctg,
      query.pos,
      query.ref,
      query.alt,
      assumeRefRef,
    )))
      .then((variants) => {
        this.setState({
          genotypes: variants.map(variant => (variant ? variant.genotype(sample) : undefined)),
        });

        if (!assumeRefRef && !every(variants)) {
          this.props.missingGenotype();
        }
      });
  }

  render() {
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Genotype</th>
            { warfarinFDA.starName.map(name => (<th>{name}</th>)) }
          </tr>
        </thead>
        <tbody>
          {warfarinFDA.association.map((assoc) => {
            const genotypes = assoc.cypGenotype.map(cypGenotype => [assoc.vkorcGenotype].concat(cypGenotype));
            return (
              <tr key={assoc.genotypes}>
                <td>{assoc.vkorcGenotype}</td>
                { assoc.phenotype.map((phenotype, index) => (
                  <td
                    className={isEqual(genotypes[index], this.state.genotypes) ? 'table-primary' : undefined}
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

    Promise.all(queries.map(query => this.props.source.variant(
      query.ctg,
      query.pos,
      query.ref,
      query.alt,
      assumeRefRef,
    )))
      .then((variants) => {
        this.setState({
          genotypes: variants.map(variant => (variant ? variant.genotype(sample) : undefined)),
        });

        if (!assumeRefRef && !every(variants)) {
          this.props.missingGenotype();
        }
      });
  }

  render() {
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Genotype</th>
            <th>Your Variant Mapping</th>
          </tr>
        </thead>
        <tbody>
          { warfarinAlg.name.map((name, index) => (
            <tr>
              <td>{name}</td>
              <td>{this.state.genotypes[index]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

class WarfarinDrug extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettingsAlert: false,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleMissingGenotype = this.handleMissingGenotype.bind(this);
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  handleMissingGenotype() {
    this.setState({ showSettingsAlert: true });
  }

  render() {
    return (
      <div>
        <h3>{ warfarinAlg.title }</h3>
        <Alert color="info" isOpen={this.state.showSettingsAlert} toggle={this.handleAlertDismiss}>
          <h4>Nothing highlighted?</h4>
          <p>
            If you are analyzing whole genome sequencing (WGS) data consider setting MySeq to assume the genotype of missing variants is the same as the reference genome. You can do so on the <Link to="/settings">settings</Link> page.
          </p>
        </Alert>
        <Row>
          <Col md={6}>
            <WarfarinFDA
              source={this.props.source}
              settings={this.props.settings}
              missingGenotype={this.handleMissingGenotype}
            />
          </Col>
          <Col md={6}>
            <p>
              This table represented the suggested daily dosage of warfarin (in mg/day) in order to achieve an optimal theraputic effect, according to the United States Food and Drug Administration. It is based on the CYP2C9 (<SNPedia title="Rs1799853" oldid={1533694} />, <SNPedia title="Rs1057910" oldid={1524224} />) and VKORC1 (<SNPedia title="Rs9923231" oldid={1530369} />) genotypes. Adapted from <PharmGKB PAid="PA451906" PAidGuide="PA166104949" />.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <WarfarinAlg
              source={this.props.source}
              settings={this.props.settings}
              missingGenotype={this.handleMissingGenotype}
            />
          </Col>
          <Col md={6}>
            <p>
              This table presents the user&apos;s reference/alternate alleles for specific genotypes to provide the correct genetic information in estimating an accurate warfarin dosage. The genotypes given in this table are as follows: VKORC1-1639/3673, CYP4F2, GGCX, CYP2C9*2, CYP2C9*3, CYP2C9*5, and CYP2C9*6.
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
