import React from 'react';
import { Link, Route } from 'react-router-dom';
import { PubMed } from '../util/links';
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
    <React.Fragment>
      <AnalysisSelector
        {...props}
        analyses={risks}
        category="Disease Risk"
        categoryPath="/risks"
        dropdownText="Choose disease"
      />
      <Route
        path="/risks"
        exact
        render={() => (
          <div>
            <p>
              Explore genomic analyses for the risk of developing the following
              diseases:
            </p>
            <ul>
              {risks.map(risk => (
                <li key={risk.route}>
                  <Link to={risk.route}>{risk.title}</Link>
                </li>
              ))}
            </ul>
            <p>
              These analyses employ multiple methods including polygenic risk
              prediction using{' '}
              <PubMed pubmedId="20497613">likelihood ratios</PubMed> and
              genotype-phenotype lookup.
            </p>
          </div>
        )}
      />
    </React.Fragment>
  );
}
