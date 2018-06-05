import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { VCFVariant } from 'myseq-vcf';

import { DbSnp } from '../util/links';

function VariantTable(props) {
  return (
    <Table bordered size="sm">
      <thead>
        <tr><th>Variant</th><th>ID(s)</th><th>Genotype</th></tr>
      </thead>
      <tbody>
        {props.variants.map(variant => (
          <tr
            key={variant.toString()}
            onClick={() => props.selectVariant(variant)}
            className={variant === props.selectedVariant ? 'table-primary' : undefined}
          >
            <td>{variant.toString()}</td>
            <td><DbSnp rsId={variant.id} /></td>
            <td>{variant.genotype()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

VariantTable.propTypes = {
  variants: PropTypes.arrayOf(PropTypes.instanceOf(VCFVariant)).isRequired,
  selectVariant: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  selectedVariant: PropTypes.instanceOf(VCFVariant),
};

VariantTable.defaultProps = {
  selectedVariant: undefined,
};

export default VariantTable;
