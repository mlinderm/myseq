import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import { get } from 'lodash-es';

import { VCFVariant } from 'myseq-vcf';
import { settingsPropType, withSettings } from '../../contexts/SettingsContext';
import { DbSnp, ClinVar, Omim } from '../util/links';

const Label = styled.dt.attrs({
  className: 'col-sm-2',
})``;

const Value = styled.dd.attrs({
  className: 'col-sm-10',
})``;

function computeAF(detail, digits = 5) {
  let genomeAN = get(detail, 'gnomad_genome.an.an');
  let exomeAN = get(detail, 'gnomad_exome.an.an');
  if (exomeAN || genomeAN) {
    exomeAN = exomeAN || 0;
    genomeAN = genomeAN || 0;
    return ((
      (get(detail, 'gnomad_genome.af.af', 0.0) * genomeAN) +
      (get(detail, 'gnomad_exome.af.af', 0.0) * exomeAN)
    ) / (genomeAN + exomeAN)).toFixed(digits);
  }
  return 'Not reported';
}

class VariantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: undefined,
      activeTab: 'sum',
    };
    this.switchTab = this.switchTab.bind(this);
  }

  componentDidMount() {
    this.updateVariantDetail(this.props.variant);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.variant !== this.props.variant) {
      this.updateVariantDetail(this.props.variant);
    }
  }

  updateVariantDetail(variant) {
    // Only fetch detail if permitted to access external services
    if (this.props.settings.external) {
      (new Promise((resolve) => {
        // MyVariant.info requires a leading chr
        const hgvs = variant.toHgvs();
        resolve(!hgvs.startsWith('chr') ? `chr${hgvs}` : hgvs);
      }))
        .then(hgvs => fetch(
          `https://myvariant.info/v1/variant/${hgvs}`,
          { mode: 'cors', 'Content-Type': 'application/json' },
        ))
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('No additional detail available for variant');
        })
        .then(detail => this.setState({ detail }))
        .catch(() => this.setState({ detail: undefined }));
    }
  }

  switchTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  renderTab(name, label, klasses = {}) {
    return (
      <NavItem>
        <NavLink
          className={classNames(Object.assign(klasses, {
            active: this.state.activeTab === name,
          }))}
          onClick={() => { this.switchTab(name); }}
        >
          {label}
        </NavLink>
      </NavItem>
    );
  }

  render() {
    const { variant, close } = this.props;
    const { detail } = this.state;

    return (
      <div>
        <hr />
        <button type="button" className="close" aria-label="Close" onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h4>{variant.toString()}</h4>
        <Nav tabs>
          {this.renderTab('sum', 'Summary')}
          {this.renderTab('pop', 'Population', { disabled: true })}
          {this.renderTab('func', 'Functional', { disabled: true })}
          {this.renderTab('clin', 'Clinical', { disabled: true })}
          {this.renderTab('lit', 'Literature', { disabled: true })}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="sum">
            <dl className="row">
              <Label>VCF Filter:</Label>
              <Value>{variant.filter || 'Unknown'}</Value>
              <Label>dbSNP:</Label>
              <Value><DbSnp rsId={get(detail, 'dbsnp.rsid') || variant.id} /></Value>
              <Label>ClinVar:</Label>
              <Value><ClinVar variantId={get(detail, 'clinvar.variant_id')} /></Value>
              <Label>OMIM:</Label>
              <Value><Omim mimNumber={get(detail, 'clinvar.omim')} /></Value>
              <Label>Allele Frequency:</Label>
              <Value>{computeAF(detail)}</Value>
            </dl>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

VariantDetail.propTypes = {
  variant: PropTypes.instanceOf(VCFVariant).isRequired,
  close: PropTypes.func.isRequired,
  settings: settingsPropType.isRequired,
};

export default withSettings(VariantDetail);
