/* eslint-disable max-len */
import React from 'react';
import LRRiskModel from './LRRiskModel';
import { PubMed } from '../util/links';

const t2d = [
  {
    variant: {
      ctg: '7', pos: 141672604, ref: 'T', alt: 'C',
    },
    rsId: 'rs9465871',
    LR: {
      'T/T': 0.918, 'T/C': 1.083, 'C/C': 1.991,
    },
  },
];

// TODO: Add additional variants from model
// TODO: Add information about T2D

// Default pretest risk is average of male/female lifetime risk from Narayan et al.

export default function Type2DiabetesRisk() {
  return (
    <LRRiskModel title="Type 2 Diabetes" preTestRisk={0.345} riskVariants={t2d}>
      <p>
        Type 2 diabetes mellitus is the most common type of diabetes, with an overall prevalence in the population in the tens of percent. Pre-test, or average risk, is computed from the overall lifetime risks for Type 2 Diabetes for different demographic groups reported in [<PubMed pubmedId={14532317} />].
      </p>
    </LRRiskModel>
  );
}
