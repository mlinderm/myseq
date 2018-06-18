import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col, Alert } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { Link } from 'react-router-dom';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import { DbSnp } from '../util/links';

class MultiVariantTrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotypes: undefined,
      showSettingsAlert: false,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = this.props.trait.variants;

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
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  render() {
    const { trait } = this.props;
    // const { variants: query } = trait;
    return (
      <div>
        <h3>{ trait.title }</h3>
        <Alert color="info" isOpen={this.state.showSettingsAlert} toggle={this.handleAlertDismiss}>
          <h4>Nothing highlighted?</h4>
          <p>
            If you are analyzing whole genome sequencing (WGS) data consider setting MySeq to assume the genotype of missing variants is the same as the reference genome. You can do so on the <Link to="/settings">settings</Link> page.
          </p>
        </Alert>
        <Row>
          <Col md={6}>
            <Table bordered>
              <thead>
                <tr>
                  {trait.rsId.map(rsId => (<th key={rsId}><DbSnp rsId={rsId} /></th>))}
                  <th>Phenotype</th>
                </tr>
              </thead>
              <tbody>
                {trait.association.map(assoc => (
                  <tr
                    key={assoc.genotypes}
                    className={((this.state.genotypes === assoc.genotypes)) ? 'table-primary' : undefined}
                  >
                    { assoc.genotypes.map((genotype, index) =>
                      (<td key={`${trait.rsId[index]}: ${genotype}`}>{genotype}</td>))}
                    <td>{assoc.phenotype}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            { this.props.children }
          </Col>
        </Row>
      </div>
    );
  }
}

MultiVariantTrait.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  trait: PropTypes.shape({
    title: PropTypes.string,
    variants: PropTypes.arrayOf(PropTypes.shape({ // hg19/b37 variant
      ctg: PropTypes.string,
      pos: PropTypes.number,
      ref: PropTypes.string,
      alt: PropTypes.string,
    })),
    rsId: PropTypes.arrayOf(PropTypes.string),
    association: PropTypes.arrayOf(PropTypes.shape({
      genotype: PropTypes.arrayOf(String), // allele/allele (with reference allele first), e.g. C/T
      phenotype: PropTypes.string,
    })),
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(MultiVariantTrait);
