import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { withSourceAndSettings, settingsPropType } from '../../contexts/context-helpers';

class SingleVariantTrait extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genotype: undefined,
    };
  }

  componentDidMount() {
    // Use assumeRefRef to always get variant
    const { sample, assumeRefRef } = this.props.settings;
    const query = this.props.trait.variant;

    this.props.source.variant(query.chr, query.pos, query.ref, query.alt, assumeRefRef)
      .then((variant) => {
        if (variant) {
          this.setState({ genotype: variant.genotype(sample) });
        }
      });
  }

  render() {
    const { trait } = this.props;
    const { variant: query } = trait;
    return (
      <div>
        <h3>{ trait.title }</h3>
        Querying the genotype for variant {`${query.chr}:g.${query.pos}${query.ref}>${query.alt}`} ({trait.rsID && (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/snp/${trait.rsID}`}>{trait.rsID}</a>)}):
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
        { this.props.children }
      </div>
    );
  }
}

SingleVariantTrait.propTypes = {
  settings: settingsPropType.isRequired,
  source: PropTypes.instanceOf(VCFSource).isRequired,
  trait: PropTypes.shape({
    title: PropTypes.string,
    variant: PropTypes.object,
    rsID: PropTypes.string,
    association: PropTypes.array,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default withSourceAndSettings(SingleVariantTrait);
