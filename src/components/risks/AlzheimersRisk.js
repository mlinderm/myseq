import React from 'react';
import styled from 'styled-components';
import MultiVariantTrait from '../analyses/MultiVariantTrait';
import { SNPedia, ExternalLink } from '../util/links';

const MonoSpan = styled.span.attrs({
  className: 'text-monospace'
})``;

const alzheimer = {
  title: "Alzheimer's Disease",
  variants: [
    {
      ctg: '19',
      pos: 45411941,
      pos_hg38: 44908684,
      ref: 'T',
      alt: 'C'
    },
    {
      ctg: '19',
      pos: 45412079,
      pos_hg38: 44908822,
      ref: 'C',
      alt: 'T'
    }
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
    { genotypes: ['C/C', 'T/T'], phenotype: 'Insufficient information' }
  ]
};

export default function AlzheimersRisk() {
  return (
    <MultiVariantTrait trait={alzheimer}>
      <p>
        These <abbr title="Single Nucleotide Polymorphism">SNPs</abbr> in the{' '}
        <i>APOE</i> gene have been associated with increased risk of late-onset
        Alzheimer&apos;s Disease. Alzheimer&apos;s disease is a progressive,
        degenerative disorder that attacks the brain&apos;s nerve cells, or
        neurons, resulting in loss of memory, thinking and language skills, and
        behavioral changes. One or more copies of the ε4 allele is associated
        with increased risk of developing Alzheimer&apos;s Disease. The ε2
        allele is rare and may have protective effects. However as described in{' '}
        <ExternalLink href="https://www.ncbi.nlm.nih.gov/books/NBK1161/">
          GeneReviews
        </ExternalLink>{' '}
        the ε4 allele is "not sufficient to cause disease" and "while{' '}
        <i>APOE</i> genotyping may have an adjunct role in the diagnosis of
        [Alzheimer&apos;s Disease] in symptomatic individuals, it appears to
        have little role at this time in predictive testing of asymptomatic
        individuals". The ε2, ε3, and ε4 alleles are determined by the
        combination of these two variants on the same chromosome. Since the{' '}
        <MonoSpan>rs429358(C)</MonoSpan> + <MonoSpan>rs7412(T)</MonoSpan>{' '}
        haplotype is extremely rare, individuals with <MonoSpan>C/T</MonoSpan>{' '}
        genotypes at both SNPs are assumed to be ε2/ε4. Adapted from{' '}
        <SNPedia title="APOE-ε4" oldid={1536640} />.
      </p>
    </MultiVariantTrait>
  );
}
