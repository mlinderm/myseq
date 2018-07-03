import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { Nav, NavItem, NavLink, TabPane, TabContent, Row, Col, Table } from 'reactstrap';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import { VCFVariant } from 'myseq-vcf';
import { settingsPropType, withSettings } from '../../contexts/SettingsContext';
import { DbSnp, ClinVar, Omim, GnomAD, GenomeBrowser } from '../util/links';

const DefList = styled.dl.attrs({
  className: 'row',
})`
  line-height: 1;
`;

const Label = styled.dt.attrs({
  className: 'col-sm-5',
})``;

const Value = styled.dd.attrs({
  className: 'col-sm-7',
})``;

const MoreLink = styled.button`
  background: none!important;
  color: #007bff;
  border: none;
  padding: 0!important;
  font: inherit;
  cursor: pointer;
`;

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

function SnpEffEffectTable(props) {
  if (!props.snpeff) {
    return null;
  }

  let { ann } = props.snpeff;
  if (!isArray(ann)) {
    ann = [ann];
  }

  return (
    <Table bordered size="sm" className="mb-0">
      <thead><tr><th>Effect</th><th>Translation</th></tr></thead>
      <tbody>
        {ann.slice(0, props.maxDisplay).map((anAnn) => {
          const { effect, feature_id: featureId, gene_id: geneId, hgvs_c: hgvsC, hgvs_p: hgvsP } = anAnn; // eslint-disable-line
          return (
            <tr key={`${featureId}:${hgvsC}`}>
              <td>{effect}</td>
              <td>{featureId}{geneId && `(${geneId})`}:{hgvsC}{hgvsP && ` (${hgvsP})`}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

SnpEffEffectTable.propTypes = {
  snpeff: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  maxDisplay: PropTypes.number,
};

SnpEffEffectTable.defaultProps = {
  snpeff: undefined,
  maxDisplay: Number.MAX_SAFE_INTEGER,
};

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
    if (this.props.settings.external && variant.alt.length === 1) {
      let chrom = variant.contig;
      if (chrom.startsWith('chr')) {
        chrom = chrom.slice(3);
      }
      if (chrom === 'M') {
        chrom = 'MT';
      }
      const alt = variant.alt[0];

      fetch(
        `https://myvariant.info/v1/query?q=chrom:${chrom} AND vcf.position:${variant.position} AND vcf.ref:${variant.ref} AND vcf.alt:${alt}`,
        { mode: 'cors', 'Content-Type': 'application/json' },
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('No additional detail available for variant');
        })
        .then((results) => {
          if (results.total === 1) {
            this.setState({ detail: results.hits[0] });
          } else {
            throw new Error('No additional detail available for variant');
          }
        })
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
        <TabContent activeTab={this.state.activeTab} className="pt-2">
          <TabPane tabId="sum">
            <Row>
              <Col md={5}>
                <DefList>
                  <Label>VCF Filter:</Label>
                  <Value>{variant.filter || 'Unknown'}</Value>
                  <Label>dbSNP:</Label>
                  <Value><DbSnp rsId={get(detail, 'dbsnp.rsid') || variant.id} /></Value>
                  <Label>Allele Frequency:</Label>
                  <Value>{computeAF(detail)}</Value>
                  <Label>UCSC:</Label>
                  <Value><GenomeBrowser variant={variant} /></Value>
                  <Label>ClinVar:</Label>
                  <Value><ClinVar variantId={get(detail, 'clinvar.variant_id')} /></Value>
                  <Label>OMIM:</Label>
                  <Value><Omim mimNumber={get(detail, 'clinvar.omim')} /></Value>
                  <Label>gnomAD:</Label>
                  <Value><GnomAD variant={variant} /></Value>
                </DefList>
              </Col>
              <Col md={7}>
                <SnpEffEffectTable snpeff={get(detail, 'snpeff')} maxDisplay={5} />
                <MoreLink onClick={() => { this.switchTab('func'); }}>more...</MoreLink>
              </Col>
            </Row>
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
