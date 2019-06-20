import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import styled from 'styled-components';
import { VCFVariant } from 'myseq-vcf';

import { DbSnp } from '../util/links';
import { withSettings, settingsPropType } from '../../contexts/SettingsContext';

const StyledTable = styled(Table)`
  table-layout: fixed;
  td {
    white-space: nowrap;
  }
  td.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  td.scrollable {
    overflow: scroll;
    overflow-y: hidden;
  }
`;

function VariantTable(props) {
  const { sample } = props.settings;
  return (
    <StyledTable bordered size="sm">
      <thead>
        <tr>
          <th className="minwidth">Chrom</th>
          <th>Position</th>
          <th>Ref</th>
          <th>Alt</th>
          <th>ID(s)</th>
          <th>Genotype</th>
        </tr>
      </thead>
      <tbody>
        {props.variants.map(variant => (
          <tr
            key={variant.toString()}
            onClick={() => props.selectVariant(variant)}
            className={
              variant === props.selectedVariant ? 'table-primary' : undefined
            }
          >
            <td className="minwidth">{variant.contig}</td>
            <td>{variant.position}</td>
            <td className="truncate">{variant.ref}</td>
            <td className="truncate">{variant.alt.join(',')}</td>
            <td className="scrollable">
              <DbSnp rsId={variant.id} />
            </td>
            <td className="truncate">{variant.genotype(sample)}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}

VariantTable.propTypes = {
  settings: settingsPropType.isRequired,
  variants: PropTypes.arrayOf(PropTypes.instanceOf(VCFVariant)).isRequired,
  selectVariant: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  selectedVariant: PropTypes.instanceOf(VCFVariant)
};

VariantTable.defaultProps = {
  selectedVariant: undefined
};

export default withSettings(VariantTable);
