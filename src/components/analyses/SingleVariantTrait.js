import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';
import SettingsAlert from './SettingsAlert';
import ReferenceAlert from './ReferenceAlert';
import { DbSnp } from '../util/links';
import { refAwareVariantQuery, variantPropType } from '../util/query';

class SingleVariantTrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotype: undefined,
      showSettingsAlert: false,
      showReferenceAlert: false,
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const query = this.props.trait.variant;

    refAwareVariantQuery(this.props.source, query, assumeRefRef)
      .then((variant) => {
        if (variant) {
          this.setState({ genotype: variant.genotype(sample) });
        } else if (!assumeRefRef) {
          this.setState({ showSettingsAlert: true });
        }
      }).catch(() => {
        // TODO: Differentiate error types
        this.setState({ showReferenceAlert: true });
      });
  }

  render() {
    const { settings, trait, children } = this.props;
    const {
      showSettingsAlert, showReferenceAlert,
    } = this.state;
    const { variant: query } = trait;
    return (
      <div>
        <h3>{ trait.title }</h3>
        <ReferenceAlert isOpen={showReferenceAlert} />
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        <Row>
          <Col md={6}>
            Querying for variant {`${query.ctg}:g.${query.pos}${query.ref}>${query.alt}`}{trait.rsId && (<span> (<DbSnp rsId={trait.rsId} />)</span>)}:
            <Table bordered>
              <thead>
                <tr><th>Genotype</th><th>Phenotype</th></tr>
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
            { children }
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
    variant: variantPropType,
    rsId: PropTypes.string,
    association: PropTypes.arrayOf(PropTypes.shape({
      genotype: PropTypes.string, // allele/allele (with reference allele first), e.g. C/T
      phenotype: PropTypes.string,
    })),
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(SingleVariantTrait);
