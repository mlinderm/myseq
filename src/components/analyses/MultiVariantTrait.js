import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import isEqual from 'lodash/isEqual';
import every from 'lodash/every';
import {
  withSourceAndSettings,
  settingsPropType
} from '../../contexts/context-helpers';
import SettingsAlert from './SettingsAlert';
import ReferenceAlert from './ReferenceAlert';
import { DbSnp } from '../util/links';
import { refAwareVariantQuery, variantPropType } from '../util/query';

class MultiVariantTrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotypes: [],
      showSettingsAlert: false,
      showReferenceAlert: false
    };
  }

  componentDidMount() {
    const { sample, assumeRefRef } = this.props.settings;
    const queries = this.props.trait.variants;

    Promise.all(
      queries.map(query =>
        refAwareVariantQuery(this.props.source, query, assumeRefRef)
      )
    )
      .then(variants => {
        this.setState({
          genotypes: variants.map(variant => {
            return variant ? variant.genotype(sample) : undefined;
          })
        });

        if (!assumeRefRef && !every(variants)) {
          this.setState({ showSettingsAlert: true });
        }
      })
      .catch(() => {
        // TODO: Differentiate error types
        this.setState({ showReferenceAlert: true });
      });
  }

  render() {
    const { settings, trait, children } = this.props;
    const { showSettingsAlert, showReferenceAlert } = this.state;
    return (
      <div>
        <h3>{trait.title}</h3>
        <ReferenceAlert isOpen={showReferenceAlert} />
        <SettingsAlert
          isOpen={showSettingsAlert && !settings.assumeRefRef}
          toggle={() => this.setState({ showSettingsAlert: false })}
        />
        <Row>
          <Col md={6}>
            <Table bordered>
              <thead>
                <tr>
                  {trait.rsId.map(rsId => (
                    <th key={rsId}>
                      <DbSnp rsId={rsId} />
                    </th>
                  ))}
                  <th>Phenotype</th>
                </tr>
              </thead>
              <tbody>
                {trait.association.map(assoc => (
                  <tr
                    key={assoc.genotypes}
                    className={
                      isEqual(this.state.genotypes, assoc.genotypes)
                        ? 'table-primary'
                        : undefined
                    }
                  >
                    {assoc.genotypes.map((genotype, index) => (
                      <td key={`${trait.rsId[index]}: ${genotype}`}>
                        {genotype}
                      </td>
                    ))}
                    <td>{assoc.phenotype}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>{children}</Col>
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
    variants: PropTypes.arrayOf(variantPropType),
    rsId: PropTypes.arrayOf(PropTypes.string),
    association: PropTypes.arrayOf(
      PropTypes.shape({
        genotypes: PropTypes.arrayOf(String), // allele/allele (with reference allele first), e.g. C/T
        phenotype: PropTypes.string
      })
    )
  }).isRequired,
  children: PropTypes.node.isRequired
};

export default withSourceAndSettings(MultiVariantTrait);
