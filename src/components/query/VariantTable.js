import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

function VariantTable(props) {
  return (
    <Table bordered size="sm">
      <thead>
        <tr><th>Variant</th><th>ID(s)</th><th>Genotype</th></tr>
      </thead>
      <tbody>
        {props.variants.map(variant => (
          <tr key={variant.toString()}>
            <td>{variant.toString()}</td>
            <td>{variant.ids}</td>
            <td>{variant.genotype()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

VariantTable.propTypes = {
  variants: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default VariantTable;
