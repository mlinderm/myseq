import React from 'react';
import AnalysisSelector from '../AnalysisSelector';

import SimvastatinDrug from './SimvastatinDrug';
import WarfarinDrug from './WarfarinDrug';

/*
Add a new drug by creating the corresponding component and adding it to the
list below.
*/

const drugs = [
  { title: 'Simvastatin', route: '/pgx/simvastatin', component: SimvastatinDrug },
  { title: 'Warfarin', route: '/pgx/warfarin', component: WarfarinDrug },
];

export default function PGx(props) {
  return (
    <AnalysisSelector {...props} analyses={drugs} category="Pharmacogenomics" categoryPath="/pgx" dropdownText="Choose drug" />
  );
}
