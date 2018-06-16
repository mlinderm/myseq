import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';
import { PubMed, SNPedia } from '../util/links';

const eyecolor = {
  title: 'Eye Color: Blue-Gray/Green',
  variant: {
    ctg: '15', pos: 28344238, ref: 'A', alt: 'G',
  },
  rsId: 'rs7495174',
  association: [
    { genotype: 'A/A', phenotype: 'Blue/gray eyes more likely' },
    { genotype: 'A/G', phenotype: 'Blue/gray eyes less likely' },
    { genotype: 'G/G', phenotype: 'Blue/gray eyes less likely' },
  ],
};

export default function EyeColorTraitGreen() {
  return (
    <SingleVariantTrait trait={eyecolor}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>OCA2</i> gene has been associated with eye color. Specifically, the A allele is commonly observed in Caucasian individuals with blue or green eye color. [<PubMed pubmedId={17236130} />] Adapted from <SNPedia title="Rs7495174" oldid={1529684} />.
      </p>
    </SingleVariantTrait>
  );
}
