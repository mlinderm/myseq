/* eslint-disable max-len */
import React from 'react';
import LRRiskModel from '../analyses/LRRiskModel';
import { PubMed } from '../util/links';

const t2d = [
  {
    variant: {
      ctg: '4',
      pos: 6292915,
      pos_hg38: 6291188,
      ref: 'A',
      alt: 'G'
    },
    rsId: 'rs10010131',
    LR: { 'A/A': 1.134, 'A/G': 1.013, 'G/G': 0.904 }
  },
  {
    variant: {
      ctg: '9',
      pos: 22134094,
      pos_hg38: 22134095,
      ref: 'T',
      alt: 'C'
    },
    rsId: 'rs10811661',
    LR: { 'T/T': 1.059, 'T/C': 0.883, 'C/C': 0.736 }
  },
  {
    variant: {
      ctg: '10',
      pos: 94462882,
      pos_hg38: 92703125,
      ref: 'C',
      alt: 'T'
    },
    rsId: 'rs1111875',
    LR: { 'C/C': 1.118, 'C/T': 0.989, 'T/T': 0.875 }
  },
  {
    variant: {
      ctg: '8',
      pos: 118184783,
      pos_hg38: 117172544,
      ref: 'C',
      alt: 'T'
    },
    rsId: 'rs13266634',
    LR: { 'C/C': 1.079, 'C/T': 0.964, 'T/T': 0.861 }
  },
  {
    variant: {
      ctg: '11',
      pos: 92673828,
      pos_hg38: 92940662,
      ref: 'C',
      alt: 'T'
    },
    rsId: 'rs1387153',
    LR: { 'C/C': 0.951, 'C/T': 1.037, 'T/T': 1.13 }
  },
  {
    variant: {
      ctg: '3',
      pos: 12393125,
      pos_hg38: 12351626,
      ref: 'C',
      alt: 'G'
    },
    rsId: 'rs1801282',
    LR: { 'C/C': 1.024, 'C/G': 0.939, 'G/G': 0.861 }
  },
  {
    variant: {
      ctg: '3',
      pos: 185511687,
      pos_hg38: 185793899,
      ref: 'G',
      alt: 'T'
    },
    rsId: 'rs4402960',
    LR: { 'G/G': 0.923, 'G/T': 1.053, 'T/T': 1.2 }
  },
  {
    variant: {
      ctg: '10',
      pos: 114758349,
      pos_hg38: 112998590,
      ref: 'C',
      alt: 'T'
    },
    rsId: 'rs7903146',
    LR: { 'C/C': 0.8, 'C/T': 1.088, 'T/T': 1.504 }
  },
  {
    variant: {
      ctg: '11',
      pos: 17409572,
      pos_hg38: 17388025,
      ref: 'T',
      alt: 'C'
    },
    rsId: 'rs5219',
    LR: { 'T/T': 1.154, 'T/C': 1.004, 'C/C': 0.873 }
  },
  {
    variant: {
      ctg: '6',
      pos: 20661250,
      pos_hg38: 20661019,
      ref: 'G',
      alt: 'C'
    },
    rsId: 'rs7754840',
    LR: { 'G/G': 0.93, 'G/C': 1.041, 'C/C': 1.166 }
  },
  {
    variant: {
      ctg: '6',
      pos: 20679709,
      pos_hg38: 20679478,
      ref: 'A',
      alt: 'G'
    },
    rsId: 'rs7756992',
    LR: { 'A/A': 0.904, 'A/G': 1.085, 'G/G': 1.302 }
  },
  {
    variant: {
      ctg: '6',
      pos: 20717255,
      pos_hg38: 20717024,
      ref: 'T',
      alt: 'C'
    },
    rsId: 'rs9465871',
    LR: { 'T/T': 0.918, 'T/C': 1.083, 'C/C': 1.991 }
  },
  {
    variant: {
      ctg: '16',
      pos: 53820527,
      pos_hg38: 53786615,
      ref: 'T',
      alt: 'A'
    },
    rsId: 'rs9939609',
    LR: { 'T/T': 0.8, 'T/A': 1.072, 'A/A': 1.24 }
  }
];

export default function Type2DiabetesRisk() {
  return (
    <LRRiskModel title="Type 2 Diabetes" preTestRisk={0.345} riskVariants={t2d}>
      <p>
        Type 2 diabetes mellitus is the most common type of diabetes, with an
        overall prevalence in the population in the tens of percent. Pre-test,
        or average risk, is computed from the overall lifetime risks for Type 2
        Diabetes for different demographic groups reported in [
        <PubMed pubmedId={14532317} />
        ].
      </p>
    </LRRiskModel>
  );
}
