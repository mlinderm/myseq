import React from 'react';
import SingleVariantTrait from '../analyses/SingleVariantTrait';
import { PubMed, SNPedia } from '../util/links';
import { MonoSpan } from '../util/style';

const eyecolor = {
  title: 'Eye Color: Brown/Blue',
  variant: {
    ctg: '15',
    pos: 28365618,
    pos_hg38: 28120472,
    ref: 'A',
    alt: 'G'
  },
  rsId: 'rs12913832',
  association: [
    { genotype: 'A/A', phenotype: 'Brown eye color more likely (80%)' },
    { genotype: 'A/G', phenotype: 'Brown eye color most likely' },
    { genotype: 'G/G', phenotype: 'Blue eye color most likely (99%)' }
  ]
};

export default function EyeColorTraitBrown() {
  return (
    <SingleVariantTrait trait={eyecolor}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr>, upstream
        of the <i>OCA2</i> gene, has been associated with eye color.
        Specifically, blue eye color is associated with the{' '}
        <MonoSpan>GG</MonoSpan> genotype. rs12913832 is part of a haplotype that
        is found in almost all Caucasians with blue eyes. rs12913832 is common
        in individuals of Caucasian descent, but rare in other groups [
        <PubMed pubmedId={18172690} />
        ], [<PubMed pubmedId={18252222} />
        ]. Adapted from <SNPedia title="Rs12913832" oldid={1533213} />.
      </p>
    </SingleVariantTrait>
  );
}
