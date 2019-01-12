/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isString from 'lodash/isString';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import { stringify } from 'query-string';
import { VCFVariant, Ref } from 'myseq-vcf';

const Icon = styled.i.attrs({
  className: 'material-icons',
})`
  font-size: 100%;
  vertical-align: text-bottom;
`;

export function PubMed(props) {
  const { pubmedId } = props;
  if (pubmedId && !isArrayLikeObject(pubmedId)) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/pubmed/${pubmedId}`}>{props.children || `PMID ${pubmedId}`}<Icon>launch</Icon></a>);
  } else if (pubmedId) {
    return pubmedId.map(anPubmed => (<PubMed key={anPubmed} pubmedId={anPubmed} />));
  }
  return null;
}

PubMed.propTypes = {
  pubmedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  children: PropTypes.node,
};

PubMed.defaultProps = {
  pubmedId: undefined,
  children: null,
};

export function DbSnp(props) {
  const { rsId } = props;
  if (rsId && isString(rsId)) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/snp/${rsId}`}>{rsId}<Icon>launch</Icon></a>);
  } else if (rsId && isArrayLikeObject(rsId)) {
    return props.rsId.map((anRsId, i) => [
      i > 0 && ', ',
      <DbSnp key={anRsId} rsId={anRsId} />,
    ]);
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
  const { variantId, variant } = props;
  if (variantId) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variantId}`}>{props.children || 'ClinVar Variant'}<Icon>launch</Icon></a>);
  } else if (variant) {
    // Search by coordinates
    const searchTerm = `${variant.contig}[Chromosome] AND ${variant.position}[Base Position for Assembly GRCh37]`;
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.ncbi.nlm.nih.gov/clinvar/?term=${encodeURIComponent(searchTerm)}`}>{props.children || 'ClinVar Search'}<Icon>launch</Icon></a>);
  }
  return null;
}

ClinVar.propTypes = {
  variantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.instanceOf(VCFVariant),
  children: PropTypes.node,
};

ClinVar.defaultProps = {
  variantId: undefined,
  variant: undefined,
  children: null,
};

export function Omim(props) {
  const { mimNumber, variant } = props;
  if (mimNumber) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.omim.org/entry/${mimNumber.replace('.', '#')}`}>{props.children || 'OMIM Entry'}<Icon>launch</Icon></a>);
  } else if (variant && variant.id) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.omim.org/search/?index=entry&start=1&search=${encodeURIComponent(variant.id.join(' '))}&sort=score+desc%2C+prefix_sort+desc&limit=10&date_created_from=&date_created_to=&date_updated_from=&date_updated_to=`}>{props.children || 'OMIM Search'}<Icon>launch</Icon></a>);
  }
  return null;
}

Omim.propTypes = {
  mimNumber: PropTypes.string,
  variant: PropTypes.instanceOf(VCFVariant),
  children: PropTypes.node,
};
Omim.defaultProps = {
  mimNumber: undefined,
  variant: undefined,
  children: null,
};

export function SNPedia(props) {
  const { title } = props;
  if (title) {
    return (<a target="_blank" rel="noreferrer noopener" href={`http://snpedia.com/index.php?${stringify(props)}`}>{props.children || 'SNPedia'}<Icon>launch</Icon></a>);
  }

  return null;
}

SNPedia.propTypes = {
  title: PropTypes.string.isRequired,
  oldid: PropTypes.number, // eslint-disable-line
  children: PropTypes.node,
};
SNPedia.defaultProps = {
  oldid: undefined,
  children: null,
};

export function PharmGKB(props) {
  const { PAid, PAidGuide } = props;
  if (PAid) {
    return (<a target="_blank" rel="noreferrer noopener" href={`https://www.pharmgkb.org/chemical/${PAid}/guideline/${PAidGuide}`}>{props.children || 'PharmGKB'}<Icon>launch</Icon></a>);
  }

  return null;
}

PharmGKB.propTypes = {
  PAid: PropTypes.string.isRequired,
  PAidGuide: PropTypes.string.isRequired,
  children: PropTypes.node,
};
PharmGKB.defaultProps = {
  children: null,
};

export function ExternalLink(props) {
  return (<a target="_blank" rel="noreferrer noopener" href={props.href}>{props.children}<Icon>launch</Icon></a>);
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function GnomAD(props) {
  const { variant } = props;
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={`http://gnomad.broadinstitute.org/variant/${variant.contig}-${variant.position}-${variant.ref}-${variant.alt[0]}`}
    >
      {props.children}<Icon>launch</Icon>
    </a>
  );
}

GnomAD.propTypes = {
  variant: PropTypes.instanceOf(VCFVariant).isRequired,
  children: PropTypes.node,
};

GnomAD.defaultProps = {
  children: 'gnomAD Search',
};

export function GenomeBrowser(props) {
  const { variant } = props;
  const ctg = Ref.hg19Reference.normalizeContig(variant.contig);
  const { position: pos } = variant;
  const region = `${ctg}:${Math.max(pos - 25, 0)}-${pos + 25}`;
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      href={`http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&highlight=hg19.${ctg}%3A${pos}-${pos}&position=${encodeURIComponent(region)}`}
    >
      {props.children || region}<Icon>launch</Icon>
    </a>
  );
}

GenomeBrowser.propTypes = {
  variant: PropTypes.instanceOf(VCFVariant).isRequired,
  children: PropTypes.node,
};

GenomeBrowser.defaultProps = {
  children: null,
};
