import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';
import { PubMed } from '../util/links';

const bitter = {
  title: 'Bitter Tasting (of PTC)',
  variant: {
    ctg: '7', pos: 141673345, ref: 'C', alt: 'G',
  },
  rsID: 'rs713598',
  association: [
    { genotype: 'C/C', phenotype: 'Possibly does not taste PTC as bitter' },
    { genotype: 'C/G', phenotype: 'Can taste PTC as bitter' },
    { genotype: 'G/G', phenotype: 'Can taste PTC as bitter' },
  ],
};

export default function BitterTastingTrait() {
  return (
    <SingleVariantTrait trait={bitter}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> is one of three variants comprising a halpotype in the <i>TAS2R38</i> gene associated with the ability to taste the compound phenylthiocarbamide (PTC) as bitter. A person who is a &ldquo;taster&rdquo; likely also carries two other variants that make up the haplotype. [<PubMed pubmedId={12595690} />]
      </p>
    </SingleVariantTrait>
  );
}
