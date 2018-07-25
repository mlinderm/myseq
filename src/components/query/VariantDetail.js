/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { Nav, NavItem, NavLink, TabPane, TabContent, Row, Col, Table } from 'reactstrap';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import { VCFVariant } from 'myseq-vcf';
import { settingsPropType, withSettings } from '../../contexts/SettingsContext';
import { DbSnp, ClinVar, Omim, GnomAD, GenomeBrowser, ExternalLink } from '../util/links';

const DefList = styled.dl.attrs({
  className: 'row',
})`
  line-height: 1;
  dd {
    min-height: 1rem;
  }
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

function GlobalAF(props) {
  const { gnomadExome, gnomadGenome } = props;
  if (isEmpty(gnomadExome) && isEmpty(gnomadGenome)) {
    return null;
  }
  const ac = get(gnomadExome, 'ac.ac', 0) + get(gnomadGenome, 'ac.ac', 0);
  const an = get(gnomadExome, 'an.an', 0) + get(gnomadGenome, 'an.an', 0);
  return (an === 0 ? 0.0 : (ac / an)).toLocaleString({ maximumFractionDigits: 5 });
}

GlobalAF.propTypes = {
  gnomadExome: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  gnomadGenome: PropTypes.obect, // eslint-disable-line react/forbid-prop-types
};

GlobalAF.defaultProps = {
  gnomadExome: {},
  gnomadGenome: {},
};

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
      <caption className="pt-1">Selected variant annotations predicted by SnpEff. <MoreLink onClick={props.moreHandler}>More...</MoreLink></caption>
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
  moreHandler: PropTypes.func.isRequired,
};

SnpEffEffectTable.defaultProps = {
  snpeff: undefined,
  maxDisplay: Number.MAX_SAFE_INTEGER,
};

function PopulationTab(props) {
  const { gnomadGenome, gnomadExome, variant } = props;
  if (isEmpty(gnomadGenome) && isEmpty(gnomadExome)) {
    return (<p>No population data available from gnomAD.</p>);
  }

  function combined(key) {
    return get(gnomadExome, key, 0) + get(gnomadGenome, key, 0);
  }

  const pops = {
    afr: { name: 'African' },
    amr: { name: 'Latino' },
    asj: { name: 'Ashkenazi Jewish' },
    eas: { name: 'East Asian' },
    fin: { name: 'European (Finnish)' },
    nfe: { name: 'European (Non-Finnish)' },
    oth: { name: 'Other' },
  };
  Object.keys(pops).forEach((key) => {
    const ac = combined(`ac.ac_${key}`);
    const an = combined(`an.an_${key}`);
    const af = an === 0 ? 0.0 : ac / an;
    pops[key] = Object.assign(pops[key], { ac, an, af });
  });

  const keys = Object.keys(pops).sort((a, b) => pops[b].af - pops[a].af);

  const totalAC = combined('ac.ac');
  const totalAN = combined('an.an');
  const totalAF = totalAN === 0 ? 0.0 : totalAC / totalAN;

  return (
    <Row>
      <Col md={8}>
        <Table bordered size="sm">
          <caption>Population data derived from the combined exome and genome data available at <GnomAD variant={variant}>gnomAD</GnomAD>.</caption>
          <thead>
            <tr>
              <th>Population</th>
              <th>Allele Count</th>
              <th>Allele Number</th>
              <th>Allele Frequency</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const {
                name, ac, an, af,
              } = pops[key];
              return (
                <tr key={key}>
                  <td>{name}</td>
                  <td>{ac}</td>
                  <td>{an}</td>
                  <td>{af.toLocaleString({ maximumFractionDigits: 5 })}</td>
                </tr>
              );
            })}
            <tr>
              <th>Total</th>
              <th>{totalAC}</th>
              <th>{totalAN}</th>
              <th>{totalAF.toLocaleString({ maximumFractionDigits: 5 })}</th>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

PopulationTab.propTypes = {
  gnomadExome: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  gnomadGenome: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  variant: PropTypes.instanceOf(VCFVariant).isRequired,
};

PopulationTab.defaultProps = {
  gnomadExome: {},
  gnomadGenome: {},
};

function ClinVarTab(props) {
  let { rcv } = props.clinvar;
  if (!rcv) {
    return (
      <p>No ClinVar annotations availabe for this variant; <ClinVar variant={props.variant}>search ClinVar instead</ClinVar>.</p>
    );
  }

  if (!isArray(rcv)) {
    rcv = [rcv];
  }

  const omim = get(props.clinvar, 'omim');

  return (
    <Row>
      <Col md={10}>
        <Table bordered size="sm">
          <caption>
            ClinVar records for this <ClinVar variantId={get(props.clinvar, 'variant_id')}>ClinVar variant</ClinVar>. { omim && <span>Additional information may be available in the <Omim mimNumber={omim}>OMIM database</Omim>.</span> }
          </caption>
          <thead>
            <tr>
              <th>Accession</th>
              <th>Significance</th>
              <th>Condition</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rcv.map((entry) => {
              const {
                accession,
                conditions,
                clinical_significance, review_status, // eslint-disable-line camelcase
              } = entry;
              const medgen = get(conditions, 'identifiers.medgen');
              return (
                <tr key={accession}>
                  <td><ExternalLink href={`https://www.ncbi.nlm.nih.gov/clinvar/${accession}`}>{accession}</ExternalLink></td>
                  <td>{clinical_significance}</td> {/* eslint-disable-line camelcase */}
                  <td>
                    {medgen ?
                      (<ExternalLink href={`https://www.ncbi.nlm.nih.gov/medgen/${medgen}`}>{conditions.name}</ExternalLink>) :
                       conditions.name
                    }
                  </td>
                  <td>{review_status}</td> {/* eslint-disable-line camelcase */}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

ClinVarTab.propTypes = {
  clinvar: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  variant: PropTypes.instanceOf(VCFVariant).isRequired,
};

ClinVarTab.defaultProps = {
  clinvar: {},
};

function FunctionalTab(props) {
  if (!props.snpeff) {
    return <p>No functional annotations available for this variant.</p>;
  }

  let { ann } = props.snpeff;
  if (!isArray(ann)) {
    ann = [ann];
  }

  return (
    <Table bordered size="sm" className="mb-0">
      <caption className="pt-1">Fuctional annotations predicted by SnpEff.</caption>
      <thead>
        <tr>
          <th>Effect</th>
          <th>Gene</th>
          <th>Transcript</th>
          <th>DNA</th>
          <th>Protein</th>
        </tr>
      </thead>
      <tbody>
        {ann.map((anAnn) => {
          const {
            effect,
            feature_id: featureId,
            gene_id: geneId,
            hgvs_c: hgvsC,
            hgvs_p: hgvsP,
          } = anAnn;
          return (
            <tr key={`${featureId}:${hgvsC}`}>
              <td>{effect}</td>
              <td>{geneId}</td>
              <td>{featureId}</td>
              <td>{hgvsC}</td>
              <td>{hgvsP}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

FunctionalTab.propTypes = {
  snpeff: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

FunctionalTab.defaultProps = {
  snpeff: undefined,
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

    const snpeff = get(detail, 'snpeff');

    return (
      <div>
        <hr />
        <button type="button" className="close" aria-label="Close" onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h4>{variant.toString()}</h4>
        <Nav tabs>
          {this.renderTab('sum', 'Summary')}
          {this.renderTab('pop', 'Population')}
          {this.renderTab('func', 'Functional')}
          {this.renderTab('clin', 'Clinical')}
          {this.renderTab('lit', 'Literature', { disabled: true })}
        </Nav>
        <TabContent activeTab={this.state.activeTab} className="pt-2">
          <TabPane tabId="sum">
            <Row>
              <Col md={5}>
                <DefList>
                  <Label>VCF Filter:</Label>
                  <Value>{variant.filter || 'Undefined'}</Value>
                  <Label>dbSNP:</Label>
                  <Value><DbSnp rsId={get(detail, 'dbsnp.rsid') || variant.id} /></Value>
                  <Label>Allele Frequency:</Label>
                  <Value>
                    <GlobalAF
                      gnomadExome={get(detail, 'gnomad_exome')}
                      gnomadGenome={get(detail, 'gnomad_genome')}
                    />
                  </Value>
                  <Label>Genome Browser:</Label>
                  <Value><GenomeBrowser variant={variant} /></Value>
                  <Label>ClinVar:</Label>
                  <Value>
                    <ClinVar
                      variantId={get(detail, 'clinvar.variant_id')}
                      variant={variant}
                    />
                  </Value>
                  <Label>OMIM:</Label>
                  <Value>
                    <Omim
                      mimNumber={get(detail, 'clinvar.omim')}
                      variant={variant}
                    />
                  </Value>
                  <Label>gnomAD:</Label>
                  <Value><GnomAD variant={variant} /></Value>
                </DefList>
              </Col>
              {snpeff && (
                <Col md={7} className="d-none d-md-block">
                  <SnpEffEffectTable
                    snpeff={snpeff}
                    maxDisplay={5}
                    moreHandler={() => this.switchTab('func')}
                  />
                </Col>
              )}
            </Row>
          </TabPane>
          <TabPane tabId="pop">
            <PopulationTab
              gnomadExome={get(detail, 'gnomad_exome')}
              gnomadGenome={get(detail, 'gnomad_genome')}
              variant={variant}
            />
          </TabPane>
          <TabPane tabId="func">
            <FunctionalTab snpeff={snpeff} />
          </TabPane>
          <TabPane tabId="clin">
            <ClinVarTab clinvar={get(detail, 'clinvar')} variant={variant} />
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
