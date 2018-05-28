/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label, FormText } from 'reactstrap';
import { settingsPropType } from '../contexts/SettingsContext';

function Settings(props) {
  const { settings, updateSettings } = props;
  return (
    <Form>
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            checked={settings.assumeRefRef}
            onChange={() => updateSettings({ assumeRefRef: !settings.assumeRefRef })}
          />
          {' '}
          Assume missing variants have reference genotype
        </Label>
        <FormText color="muted">
          Select when analyzing whole genome sequencing (WGS) data. Most WGS analysis pipelines only report sites different from the reference genome. When this option is selected, MySeq will assume that unreported sites have homozygous reference genotypes.
        </FormText>
      </FormGroup>

      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            checked={settings.external}
            onChange={() => updateSettings({ external: !settings.external })}
          />
          {' '}
          Allow queries to external services
        </Label>
        <FormText color="muted">
          MySeq can query external services to obtain more information about variants, genes and other identifiers. MySeq <b>never</b> sends your genotype to an external service (that is which specific alleles you have), only the variant description (that is the &ldquo;edit&rdquo; to the reference genome). However, a combination of rare variants, even without genoytpes, may still be identifiable.
        </FormText>
      </FormGroup>
    </Form>
  );
}

Settings.propTypes = {
  settings: settingsPropType.isRequired,
  updateSettings: PropTypes.func.isRequired,
};


export default Settings;
