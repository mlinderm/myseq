import React from 'react';
import SingleVariantTrait from '../analyses/SingleVariantTrait';
import { PubMed } from '../util/links';

const asparagus = {
  title: 'Asparagus Asnomia',
  variant: {
    ctg: '1',
    pos: 248496863,
    pos_hg38: 248333561,
    ref: 'A',
    alt: 'G'
  },
  rsId: 'rs4481887',
  association: [
    {
      genotype: 'A/A',
      phenotype: 'Most likely to smell asparagus metabolites in urine'
    },
    {
      genotype: 'A/G',
      phenotype: 'More likely to smell asparagus metabolites in urine'
    },
    {
      genotype: 'G/G',
      phenotype: 'Least likely to smell asparagus metabolites in urine'
    }
  ]
};

export default function AsparagusTrait() {
  return (
    <SingleVariantTrait trait={asparagus}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> near the{' '}
        <i>OR2M7</i> gene is associated with the ability to smell the
        methanethiol produced after eating asparagus. [
        <PubMed pubmedId={20876394} />]
      </p>
    </SingleVariantTrait>
  );
}
