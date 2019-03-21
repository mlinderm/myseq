import React from 'react';
import AnalysisSelector from '../AnalysisSelector';

import Type2DiabetesRisk from './Type2DiabetesRisk';
import AlzheimersRisk from './AlzheimersRisk';

/*
Add a new disease by creating the corresponding component and adding it to the
list below.
*/

const risks = [
  {
    title: 'Type 2 Diabetes',
    route: '/risks/t2d',
    component: Type2DiabetesRisk
  },
  {
    title: "Alzheimer's Disease",
    route: '/risks/alzheimers',
    component: AlzheimersRisk
  }
];

export default function Risks(props) {
  return (
    <AnalysisSelector
      {...props}
      analyses={risks}
      category="Disease Risk"
      categoryPath="/risks"
      dropdownText="Choose disease"
    />
  );
}
