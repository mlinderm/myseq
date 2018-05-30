/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row, Form, FormGroup, Label, Input, FormFeedback, FormText, Button } from 'reactstrap';
import { VCFSource } from 'myseq-vcf';

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

class CoordinateSearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.createSearch = this.createSearch.bind(this);
  }

  handleSearchChange(evt) {
    this.setState({ region: evt.target.value });
  }

  handleQuery(evt) {
    evt.preventDefault();
    const { region } = this.state;

    const coords = region.split(/[:-]/, 3);
    if (coords.length === 2) {
      this.props.coordinateQuery(`${region}-${coords[1]}`);
    } else {
      this.props.coordinateQuery(this.state.region);
    }
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
      <Form onSubmit={this.handleQuery}>
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
              Examples: chr1:1-100, {this.createSearch('chr7:141672604')}, BRCA1, rs10246939
            </FormText>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

CoordinateSearchBox.propTypes = {
  coordinateQuery: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  helpMessage: PropTypes.string.isRequired,
};

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

  handleCoordinateQuery(region) {
    // TODO: Normalize contig name
    const coords = region.split(/[:-]/, 3);
    this.props.source.variants(coords[0], parseInt(coords[1], 10), parseInt(coords[2], 10)).then(
      (variants) => {
        this.setState({
          region,
          variants,
          error: false,
          helpMessage: '',
        });
      },
      (err) => {
        this.setState({
          error: true,
          helpMessage: err.message,
          variants: [],
        });
      },
    );
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
