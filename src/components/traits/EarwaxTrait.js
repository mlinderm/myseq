import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';

const earwax = {
  title: 'Earwax Consistency',
  variant: {
    chr: '16', pos: 48258198, ref: 'C', alt: 'T',
  },
  association: [
    { genotype: 'C/C', phenotype: 'Wet earwax' },
    { genotype: 'C/T', phenotype: 'Wet earwax' },
    { genotype: 'T/T', phenotype: 'Dry earwax' },
  ],
};

function EarwaxTrait() {
  return (
    <SingleVariantTrait trait={earwax}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>ABCC11</i> gene determines human earwax consistency. The TT genotype is associated with &ldquo;dry earwax&rdquo;, while CC and CT are associated with &ldquo;wet earwax&rdquo;. This SNP is also a proxy for East Asian ancestry; the T allele is more common in East Asian populations. [<a target="_blank" rel="noreferrer noopener" href="https://www.ncbi.nlm.nih.gov/pubmed/16444273">PMID 16444273</a>]
      </p>
    </SingleVariantTrait>
  );
}

export default EarwaxTrait;
