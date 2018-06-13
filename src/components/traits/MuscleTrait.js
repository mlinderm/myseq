import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';
import { PubMed, SNPedia } from '../util/links';

const muscle = {
  title: 'Muscle Performance',
  variant: {
    ctg: '11', pos: 66328095, ref: 'T', alt: 'C',
  },
  rsId: 'rs1815739',
  association: [
    { genotype: 'T/T', phenotype: 'Likely endurance athlete' },
    { genotype: 'T/C', phenotype: 'Likely sprinter' },
    { genotype: 'C/C', phenotype: 'Likely sprinter' },
  ],
};

export default function MuscleTrait() {
  return (
    <SingleVariantTrait trait={muscle}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>ACTN3</i> gene has been associated with muscle performance in elite athlete. The T allele (termed the &lsquo;X&lrsquo; allele) is reported to be underrepresented in elite endurance athletes. [<PubMed pubmedId={18043716} />] Subsequent studies have not replicated the originally reported association. Adapted from <SNPedia title="Rs1815739" oldid={1536618} />.
      </p>
    </SingleVariantTrait>
  );
}
