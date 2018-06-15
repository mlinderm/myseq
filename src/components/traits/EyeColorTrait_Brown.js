import React from 'react';
import SingleVariantTrait from './SingleVariantTrait';
import { PubMed, SNPedia } from '../util/links';

const eyecolor = {
  title: 'Eye Color: Brown/Blue',
  variant: {
    ctg: '15', pos: 28365618, ref: 'A', alt: 'G',
  },
  rsId: 'rs12913832',
  association: [
    { genotype: 'A/A', phenotype: 'Brown eye color more likely (80%)' },
    { genotype: 'A/G', phenotype: 'Brown eye color most likely' },
    { genotype: 'G/G', phenotype: 'Blue eye color most likely (99%)' },
  ],
};

export default function EyeColorTraitBrown() {
  return (
    <SingleVariantTrait trait={eyecolor}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>OCA2</i> gene has been associated with eye color. Specifically, blue eye color is associated with the (G;G) genotype. rs12913832 is also part of a halotype where variations in rs1129038 and rs12913832 are generally found in Caucasians, but relatively rare among other racial groups. [<PubMed pubmedId={18172690} />], [<PubMed pubmedId={18252222} />]. Adapted from <SNPedia title="Rs12913832" oldid={1533213} />.
      </p>
    </SingleVariantTrait>
  );
}
