import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';

const trait = {
  title: 'Asparagus Asnomia',
  variant: {
    chr: 1, pos: 248496863, ref: 'A', alt: 'G',
  },
  rsID: 'rs4481887',
  association: [
    { genotype: 'A/A', phenotype: 'Most likely to smell asparagus metabolites in urine' },
    { genotype: 'A/G', phenotype: 'More likely to smell asparagus metabolites in urine' },
    { genotype: 'G/G', phenotype: 'Least likely to smell asparagus metabolites in urine' },
  ],
};

function AsparagusTrait() {
  return (
    <SingleVariantTrait trait={trait}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> near the <i>OR2M7</i> gene is associated with the ability to smell the methanethiol produced after eating asparagus. [<a target="_blank" rel="noreferrer noopener" href="https://www.ncbi.nlm.nih.gov/pubmed/20876394">PMID 20876394</a>]
      </p>
    </SingleVariantTrait>
  );
}

export default AsparagusTrait;
