import React from 'react';
import SingleVariantTrait from '../traits/SingleVariantTrait';
import { PubMed, SNPedia, PharmGKB } from '../util/links';

const simvastatin = {
  title: 'Simvastatin',
  variant: {
    ctg: '12', pos: 21331549, ref: 'T', alt: 'C',
  },
  rsId: 'rs4149056',
  association: [
    { genotype: 'T/T', phenotype: 'Normal myopathy risk. Recommended Dosage: Prescribe starting dose, adjust as necessary.' },
    { genotype: 'T/C', phenotype: 'Intermediate myopathy risk. Recommended Dosage: Prescribe lower dose or consider an alternative statin (e.g. pravastatin or rosuvastatin).' },
    { genotype: 'C/C', phenotype: 'High myopathy risk. Recommended Dosage: Prescribe lower dose or consider an alternative statin (e.g. pravastatin or rosuvastatin).' },
  ],
};

export default function SimvastatinDrug() {
  return (
    <SingleVariantTrait trait={simvastatin}>
      <p>
        This <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the <i>SLCO1B1</i> gene is commonly used to predict risk for myopathy,  a muscle tissue disease. Those with the C allele at rs4149056 are at higher risk for myopathy, even at low dosages. [<PubMed pubmedId={16758257} />] Adapted from <PharmGKB PAid="PA451363" PAidGuide="PA166105005" />, <SNPedia title="Rs4149056" oldid={1528370} />.
      </p>
    </SingleVariantTrait>
  );
}
