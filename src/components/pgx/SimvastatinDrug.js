import React from 'react';
import SingleVariantTrait from '../analyses/SingleVariantTrait';
import { PubMed, PharmGKB } from '../util/links';

const simvastatin = {
  title: 'Simvastatin',
  variant: {
    ctg: '12',
    pos: 21331549,
    pos_hg38: 21178615,
    ref: 'T',
    alt: 'C'
  },
  rsId: 'rs4149056',
  association: [
    {
      genotype: 'T/T',
      phenotype:
        'Normal myopathy risk. CPIC Recommended Dosage: Prescribe desired starting dose and adjust doses of simvastatin based on disease-specific guidelines.'
    },
    {
      genotype: 'T/C',
      phenotype:
        'Intermediate myopathy risk. CPIC Recommended Dosage: Prescribe a lower dose or consider an alternative statin (e.g., pravastatin or rosuvastatin); consider routine CK surveillance.'
    },
    {
      genotype: 'C/C',
      phenotype:
        'High myopathy risk. CPIC Recommended Dosage: Prescribe a lower dose or consider an alternative statin (e.g., pravastatin or rosuvastatin); consider routine CK surveillance.'
    }
  ]
};

export default function SimvastatinDrug() {
  return (
    <SingleVariantTrait trait={simvastatin}>
      <p>
        Simvastatin is among the most commonly used prescription medications for
        cholesterol reduction. This{' '}
        <abbr title="Single Nucleotide Polymorphism">SNP</abbr> in the{' '}
        <i>SLCO1B1</i> gene increases the risk of muscle toxicity, including
        myopathy, in patients taking Simvastatin. Adapted from{' '}
        <PharmGKB PAid="PA451363" PAidGuide="PA166105005" /> and the{' '}
        <PubMed pubmedId={24918167}>CPIC Guidelines</PubMed>.
      </p>
    </SingleVariantTrait>
  );
}
