import React from 'react';
import SingleVariantTrait from '../analyses/SingleVariantTrait';
import { PubMed, SNPedia } from '../util/links';
import { MonoSpan } from '../util/style';

const eyecolor = {
  title: 'Eye Color: Blue-Gray/Green',
  variant: {
    ctg: '15',
    pos: 28344238,
    pos_hg38: 28099092,
    ref: 'A',
    alt: 'G'
  },
  rsId: 'rs7495174',
  association: [
    { genotype: 'A/A', phenotype: 'Blue/gray eyes more likely' },
    { genotype: 'A/G', phenotype: 'Blue/gray eyes less likely' },
    { genotype: 'G/G', phenotype: 'Blue/gray eyes less likely' }
  ]
};

export default function EyeColorTraitGreen() {
  return (
    <SingleVariantTrait trait={eyecolor}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the{' '}
        <i>OCA2</i> gene has been associated with eye color. The{' '}
        <MonoSpan>A</MonoSpan> allele often produces blue or green eye color in
        Caucasians [
        <PubMed pubmedId={17236130} />
        ]. Adapted from <SNPedia title="Rs7495174" oldid={1529684} />.
      </p>
    </SingleVariantTrait>
  );
}
