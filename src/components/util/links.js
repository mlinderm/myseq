/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isString, isArrayLikeObject } from 'lodash-es';

const Icon = styled.i.attrs({
  className: 'material-icons',
})`
  font-size: 100%;
  vertical-align: text-bottom;
`;

export function PubMed(props) {
  const { pubmedId } = props;
  if (pubmedId && !isArrayLikeObject(pubmedId)) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/pubmed/${pubmedId}`}>PMID {pubmedId}<Icon>launch</Icon></a>);
  } else if (pubmedId) {
    return pubmedId.map(anPubmed => (<PubMed key={anPubmed} pubmedId={anPubmed} />));
  }
  return null;
}

PubMed.propTypes = {
  pubmedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
};

PubMed.defaultProps = {
  pubmedId: undefined,
};

export function DbSnp(props) {
  const { rsId } = props;
  if (rsId && isString(rsId)) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/snp/${rsId}`}>{rsId}<Icon>launch</Icon></a>);
  } else if (rsId && isArrayLikeObject(rsId)) {
    return props.rsId.map(anRsId => (<DbSnp key={anRsId} rsId={anRsId} />));
  }
  return null;
}

DbSnp.propTypes = {
  rsId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

DbSnp.defaultProps = {
  rsId: undefined,
};

export function ClinVar(props) {
  const { variantId } = props;
  if (variantId) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variantId}`}>{props.children || 'ClinVar Variant'}<Icon>launch</Icon></a>);
  }
  // TODO: Generate search instead
  return null;
}

ClinVar.propTypes = {
  variantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};

ClinVar.defaultProps = {
  variantId: undefined,
  children: null,
};

export function Omim(props) {
  const { mimNumber } = props;
  if (mimNumber) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.omim.org/entry/${mimNumber.replace('.', '#')}`}>{props.children || 'OMIM Entry'}<Icon>launch</Icon></a>);
  }
  // TODO: Generate search instead
  return null;
}

Omim.propTypes = {
  mimNumber: PropTypes.string,
  children: PropTypes.node,
};
Omim.defaultProps = {
  mimNumber: undefined,
  children: null,
};