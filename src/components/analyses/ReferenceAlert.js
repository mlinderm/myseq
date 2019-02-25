import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

export default function ReferenceAlert(props) {
  return (
    <Alert color="danger" {...props} >
      <h4>Unsupported Reference Genome For This Analysis</h4>
      <p>
        This analysis does not support the reference genome used in this VCF file.
      </p>
    </Alert>
  );
}

ReferenceAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};
