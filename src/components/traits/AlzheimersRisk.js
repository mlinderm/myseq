import React from 'react';
import MultiVariantTrait from './MultiVariantTrait';
import { SNPedia } from '../util/links';

const alzheimer = {
  title: 'Alzheimer Risk',
  variants: [
    {
      ctg: '19', pos: 45411941, ref: 'T', alt: 'C',
    },
    {
      ctg: '19', pos: 45412079, ref: 'C', alt: 'T',
    },
  ],
  rsId: ['rs429358', 'rs7412'],
  association: [
    { genotypes: ['T/T', 'C/C'], phenotype: 'ε3/ε3: No change in risk' },
    { genotypes: ['T/T', 'C/T'], phenotype: 'ε3/ε2: No change in risk' },
    { genotypes: ['T/T', 'T/T'], phenotype: 'ε2/ε2: No change in risk' },
    { genotypes: ['T/C', 'C/C'], phenotype: 'ε3/ε4: 2-fold increased risk' },
    { genotypes: ['T/C', 'C/T'], phenotype: 'ε2/ε4: 2-fold increased risk' },
    { genotypes: ['T/C', 'T/T'], phenotype: 'Insufficient information' },
    { genotypes: ['C/C', 'C/C'], phenotype: 'ε4/ε4: 11-fold increased risk' },
    { genotypes: ['C/C', 'C/T'], phenotype: 'Insufficient information' },
    { genotypes: ['C/C', 'T/T'], phenotype: 'Insufficient information' },
  ],
};

export default function AlzheimersRiskTrait() {
  return (
    <MultiVariantTrait trait={alzheimer}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>APOE</i> gene has been associated with increased risk of late-onset Alzheimer&apos;s Disease. Specifically, those with the ε4/ε4 variants have the highest levels of increased risk. The ε3 variant is the most common variant, and poses less increased risk than the ε4 variant, and the ε2 variant is rare and show signs of possible protective effects against Alzheimers. The APOE variant is determined by the assumption that the rs429358(C) + rs7412(T) combination has never been seen before, thus those with CT at both SNPs are assumed to be ε2/ε4 and those with  CT at rs429358 and CC at rs7412 are assumed to be ε3/ε4. Adapted from <SNPedia title="APOE-ε4" oldid={1536640} />. (Information about the alleles: <SNPedia title="Rs7412" oldid={1535978} />, <SNPedia title="Rs429358" oldid={1537592} />.)
      </p>
    </MultiVariantTrait>
  );
}
