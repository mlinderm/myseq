import React from 'react';
import { Link, Route } from 'react-router-dom';
import AnalysisSelector from '../AnalysisSelector';

import AncestryPCA from './AncestryPCA';

const ancestries = [
  { title: 'PCA Analysis', route: '/ancestry/pca', component: AncestryPCA }
];

export default function Ancestry(props) {
  return (
    <React.Fragment>
      <AnalysisSelector
        {...props}
        analyses={ancestries}
        category="Ancestry"
        categoryPath="/ancestry"
        dropdownText="Choose analysis"
      />
      <Route
        path="/ancestry"
        exact
        render={() => (
          <div>
            <p>Explore the following genomic ancestry analyses:</p>
            <ul>
              {ancestries.map(ancestry => (
                <li key={ancestry.route}>
                  <Link to={ancestry.route}>{ancestry.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </React.Fragment>
  );
}
