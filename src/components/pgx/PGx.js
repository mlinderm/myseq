import React from 'react';
import { Link, Route } from 'react-router-dom';
import { ExternalLink } from '../util/links';
import AnalysisSelector from '../AnalysisSelector';

import SimvastatinDrug from './SimvastatinDrug';
import WarfarinDrug from './WarfarinDrug';

/*
Add a new drug by creating the corresponding component and adding it to the
list below.
*/

const drugs = [
  {
    title: 'Simvastatin',
    route: '/pgx/simvastatin',
    component: SimvastatinDrug
  },
  { title: 'Warfarin', route: '/pgx/warfarin', component: WarfarinDrug }
];

export default function PGx(props) {
  return (
    <React.Fragment>
      <AnalysisSelector
        {...props}
        analyses={drugs}
        category="Pharmacogenomics"
        categoryPath="/pgx"
        dropdownText="Choose drug"
      />
      <Route
        path="/pgx"
        exact
        render={() => (
          <div>
            <p>
              Explore genomic analyses for drug safety and efficacy for the
              following drugs:
            </p>
            <ul>
              {drugs.map(drug => (
                <li key={drug.route}>
                  <Link to={drug.route}>{drug.title}</Link>
                </li>
              ))}
            </ul>
            <p>
              The gene-drug relationships and associated clinical guidelines are
              sourced from{' '}
              <ExternalLink href="https://www.pharmgkb.org">
                PharmGKB
              </ExternalLink>{' '}
              and the{' '}
              <ExternalLink href="https://cpicpgx.org/guidelines/">
                CPIC guidlines
              </ExternalLink>
              .
            </p>
          </div>
        )}
      />
    </React.Fragment>
  );
}
