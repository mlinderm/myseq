import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col, Alert } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { Link } from 'react-router-dom';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import { DbSnp } from '../util/links';

class SingleVariantTrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotype: undefined,
      showSettingsAlert: false,
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const query = this.props.trait.variant;

    this.props.source.variant(query.ctg, query.pos, query.ref, query.alt, assumeRefRef)
      .then((variant) => {
        if (variant) {
          this.setState({ genotype: variant.genotype(sample) });
        } else if (!assumeRefRef) {
          this.setState({ showSettingsAlert: true });
        }
      });
  }

  handleAlertDismiss() {
    this.setState({ showSettingsAlert: false });
  }

  render() {
    const { trait } = this.props;
    const { variant: query } = trait;
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
            Querying for variant {`${query.ctg}:g.${query.pos}${query.ref}>${query.alt}`} {trait.rsId && (<span>(<DbSnp rsId={trait.rsId} />)</span>)}:
            <Table bordered>
              <thead>
                <tr><th>Genotype (Var 1)</th><th>Genotype (Var 2)</th><th>Phenotype</th></tr>
              </thead>
              <tbody>
                { trait.association.map(assoc => (
                  <tr
                    key={assoc.genotype}
                    className={(this.state.genotype === assoc.genotype) ? 'table-primary' : undefined}
                  >
                    <td>{assoc.genotype}</td>
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

/*
Example trait object for "Bitter Tasting" phenotype
{
  title: 'Bitter Tasting (of PTC)',
  variant: {
    chr: '7', pos: 141673345, ref: 'C', alt: 'G',
  },
  rsID: 'rs713598',
  association: [
    { genotype: 'C/C', phenotype: 'Possibly does not taste PTC as bitter' },
    { genotype: 'C/G', phenotype: 'Can taste PTC as bitter' },
    { genotype: 'G/G', phenotype: 'Can taste PTC as bitter' },
  ],
};
*/

SingleVariantTrait.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  trait: PropTypes.shape({
    title: PropTypes.string,
    variant: PropTypes.shape({ // hg19/b37 variant with VCF ctg, pos, ref, alt fields
      ctg: PropTypes.string,
      pos: PropTypes.number,
      ref: PropTypes.string,
      alt: PropTypes.string,
    }),
    rsId: PropTypes.string,
    association: PropTypes.arrayOf(PropTypes.shape({
      genotype: PropTypes.string, // allele/allele (with reference allele first), e.g. C/T
      phenotype: PropTypes.string,
    })),
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(SingleVariantTrait);
