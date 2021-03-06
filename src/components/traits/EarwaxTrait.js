import React from 'react';
import SingleVariantTrait from '../analyses/SingleVariantTrait';
import { PubMed } from '../util/links';
import { MonoSpan } from '../util/style';

const earwax = {
  title: 'Earwax Consistency',
  variant: {
    ctg: '16',
    pos: 48258198,
    pos_hg38: 48224287,
    ref: 'C',
    alt: 'T'
  },
  rsId: 'rs17822931',
  association: [
    { genotype: 'C/C', phenotype: 'Wet earwax' },
    { genotype: 'C/T', phenotype: 'Wet earwax' },
    { genotype: 'T/T', phenotype: 'Dry earwax' }
  ]
};

export default function EarwaxTrait() {
  return (
    <SingleVariantTrait trait={earwax}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the{' '}
        <i>ABCC11</i> gene determines human earwax consistency. The{' '}
        <MonoSpan>TT</MonoSpan> genotype is associated with &ldquo;dry
        earwax&rdquo;, while <MonoSpan>CC</MonoSpan> and <MonoSpan>CT</MonoSpan>{' '}
        are associated with &ldquo;wet earwax&rdquo;. This SNP is also a proxy
        for East Asian ancestry; the <MonoSpan>T</MonoSpan> allele is more
        common in East Asian populations [<PubMed pubmedId={16444273} />
        ].
      </p>
    </SingleVariantTrait>
  );
}
