import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function SettingsAlert(props) {
  return (
    <Alert color="info" {...props} >
      <h4>Nothing highlighted or missing entries?</h4>
      <p>
        If you are analyzing whole genome sequencing (WGS) data consider setting MySeq to assume the genotype of missing variants is the same as the reference genome. You can do so on the <Link to="/settings">settings</Link> page. Use the &lsquo;back&rsquo; button to return to this analysis.
      </p>
    </Alert>
  );
}

SettingsAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
