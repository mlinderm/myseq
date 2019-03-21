import React from 'react';
import AnalysisSelector from '../AnalysisSelector';

import AncestryPCA from './AncestryPCA';
import ChromosomePainting from './ChromosomePainting';

const risks = [
  { title: 'PCA Analysis', route: '/ancestry/pca', component: AncestryPCA },
  {
    title: 'Bayesian Analysis',
    route: '/ancestry/painting',
    component: ChromosomePainting
  }
];

export default function Ancestry(props) {
  return (
    <AnalysisSelector
      {...props}
      analyses={risks}
      category="Ancestry"
      categoryPath="/ancestry"
      dropdownText="Choose analysis"
    />
  );
}
