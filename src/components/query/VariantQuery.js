/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row, Form, FormGroup, Label, Input, FormFeedback, FormText, Button } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';
import { flatten, identity } from 'lodash-es';

import { withSettings, settingsPropType } from '../../contexts/SettingsContext';
import VariantTable from './VariantTable';
import VariantDetail from './VariantDetail';


const QueryExample = styled.button`
  background: none!important;
  color: #007bff;
  border: none;
  padding: 0!important;
  font: inherit;
  cursor: pointer;
`;

class CoordinateSearchBoxImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleQueries = this.handleQueries.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.createSearch = this.createSearch.bind(this);
  }

  handleSearchChange(evt) {
    this.setState({ region: evt.target.value });
  }

  handleQuery(region) {
    if (region.startsWith('rs')) {
      // Obtain coordinates for rsID if external queries are permitted
      if (!this.props.settings.external) {
        return Promise.reject(new Error('Querying external services must be enabled to search by rsID'));
      }
      return fetch(
        `https://myvariant.info/v1/query?q=dbsnp.rsid:${region}&fields=dbsnp.chrom,dbsnp.hg19`,
        { mode: 'cors', 'Content-Type': 'application/json' },
      )
        .then(response => ((response.ok) ? response.json() : ({ total: 0 })))
        .then((results) => {
          if (results.total === 1) {
            const { chrom, hg19 } = results.hits[0].dbsnp;
            return `${chrom}:${hg19.start}-${hg19.end}`;
          }
          throw new Error('Unknown or invalid rsID');
        });
    } else if (region.includes(':')) {
      // Query is likely specified as a region, i.e. chr1:1-100
      return Promise.resolve(region);
    } else { // eslint-disable-line no-else-return
      // Attempt query as a gene symbol
      if (!this.props.settings.external) {
        return Promise.reject(new Error('Querying external services must be enabled to search by gene name'));
      }
      return fetch(
        `http://mygene.info/v3/query?q=symbol:${region}&fields=genomic_pos&species=human`,
        { mode: 'cors', 'Content-Type': 'application/json' },
      )
        .then(response => ((response.ok) ? response.json() : ({ total: 0 })))
        .then((results) => {
          if (results.total === 1) {
            const { chr, start, end } = results.hits[0].genomic_pos;
            return `${chr}:${start}-${end}`;
          }
          throw new Error('Unknown or invalid gene symbol');
        });
    }
  }

  handleQueries(evt) {
    evt.preventDefault();
    Promise.all(this.state.region.split(/[ ,]/).filter(identity).map(this.handleQuery))
      .then(this.props.coordinateQuery, this.props.coordinateQuery);
  }

  createSearch(search) {
    return (
      <QueryExample onClick={(evt) => {
        evt.preventDefault();
        this.setState({ region: search });
        }}
      >
        {search}
      </QueryExample>);
  }

  render() {
    // TODO: Auto load example queries
    return (
      <Form onSubmit={this.handleQueries}>
        <FormGroup row>
          <Col sm={12} md={6}>
            <Label for="query-text" hidden>Query by genomic coordinates</Label>
            <Row>
              <Col>
                <Input id="query-text" type="text" value={this.state.region} onChange={this.handleSearchChange} invalid={this.props.error} placeholder="Query by genomic coordinates" />
                <FormFeedback>{this.props.helpMessage}</FormFeedback>
              </Col>
              <Col xs="auto">
                <Button type="submit">Query</Button>
              </Col>
            </Row>
            <FormText>
              Examples: chr1:1-100, {this.createSearch('chr7:141672604')}, {this.createSearch('BRCA1')}, {this.createSearch('rs10246939')}
            </FormText>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

CoordinateSearchBoxImpl.propTypes = {
  settings: settingsPropType.isRequired,
  coordinateQuery: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  helpMessage: PropTypes.string.isRequired,
};

const CoordinateSearchBox = withSettings(CoordinateSearchBoxImpl);

class VariantQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: undefined,
      error: false,
      helpMessage: '',
      variants: [],
      selectedVariant: undefined,
    };

    this.handleCoordinateQuery = this.handleCoordinateQuery.bind(this);
    this.handleSelectVariant = this.handleSelectVariant.bind(this);
    this.handleCloseDetail = this.handleSelectVariant.bind(this, undefined);
  }

  handleCoordinateQuery(regions) {
    const { source } = this.props;

    if (regions instanceof Error) {
      this.setState({
        error: true, helpMessage: regions.message, variants: [], selectedVariant: undefined,
      });
      return;
    }

    // TODO: Normalize query (contig name, overlapping chunks, etc.)
    source.normalizeRegions(regions)
      .then((normRegions) => {
        this.setState({
          region: normRegions.map((region) => {
            const { ctg, pos, end } = region;
            return `${ctg}:${pos}-${end}`;
          }).join(', '),
        });
        return Promise.all(normRegions.map((region) => {
          const { ctg, pos, end } = region;
          return source.variants(ctg, pos, end);
        }));
      })
      .then(flatten)
      .then((variants) => {
        this.setState({
          variants,
          selectedVariant: undefined,
          error: false,
          helpMessage: '',
        });
      })
      .catch((err) => {
        this.setState({
          error: true,
          helpMessage: err.message,
          region: undefined,
          variants: [],
          selectedVariant: undefined,
        });
      });
  }

  handleSelectVariant(variant) {
    this.setState({ selectedVariant: variant });
  }

  render() {
    const { region, variants, selectedVariant } = this.state;
    return (
      <div>
        <CoordinateSearchBox
          coordinateQuery={this.handleCoordinateQuery}
          error={this.state.error}
          helpMessage={this.state.helpMessage}
        />
        {region &&
          <Row>
            <Col sm={6}>
              <p>Listing {variants.length} variant(s) in {region}</p>
              <VariantTable
                variants={variants}
                selectVariant={this.handleSelectVariant}
                selectedVariant={selectedVariant}
              />
            </Col>
          </Row>
        }
        {selectedVariant &&
          <VariantDetail variant={selectedVariant} close={this.handleCloseDetail} />
        }
      </div>
    );
  }
}

VariantQuery.propTypes = {
  source: PropTypes.instanceOf(VCFSource).isRequired,
};

export default VariantQuery;
