/* eslint-disable import/prefer-default-export */
import React from 'react';

export function dbSNP(rsId) {
  if (rsId) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/snp/${rsId}`}>{rsId}<i className="material-icons">launch</i></a>);
  }
  return undefined;
}

export function clinVarVariant(variantId, text = undefined) {
  if (variantId) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variantId}`}>{text || 'ClinVar Variant'}<i className="material-icons">launch</i></a>);
  }
  // TODO: Generate search instead
  return undefined;
}

export function omimVariant(entry, text = undefined) {
  if (entry) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.omim.org/entry/${entry.replace('.', '#')}`}>{text || 'OMIM Entry'}<i className="material-icons">launch</i></a>);
  }
  // TODO: Generate search instead
  return undefined;
}
