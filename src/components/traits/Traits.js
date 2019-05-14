import React from 'react';
import { Link, Route } from 'react-router-dom';
import AnalysisSelector from '../AnalysisSelector';

import EarwaxTrait from './EarwaxTrait';
import AsparagusTrait from './AsparagusTrait';
import BitterTastingTrait from './BitterTastingTrait';
import MuscleTrait from './MuscleTrait';
import EyeColorTraitBrown from './EyeColorTrait_Brown';
import EyeColorTraitGreen from './EyeColorTrait_Green';

/*
Add a new trait by creating the corresponding component and adding it to the
list below. Each trait component contains the variant, genotype-phenotype mapping
and a brief explanation of the trait.
*/

const traits = [
  {
    title: 'Earwax Consistency',
    route: '/traits/earwax',
    component: EarwaxTrait
  },
  {
    title: 'Asparagus Asnomia',
    route: '/traits/asparagus',
    component: AsparagusTrait
  },
  {
    title: 'Bitter Tasting',
    route: '/traits/bitter',
    component: BitterTastingTrait
  },
  {
    title: 'Muscle Performance',
    route: '/traits/muscle',
    component: MuscleTrait
  },
  {
    title: 'Eye Color: Blue-Gray/Green',
    route: '/traits/eyecolorgreen',
    component: EyeColorTraitGreen
  },
  {
    title: 'Eye Color: Brown/Blue',
    route: '/traits/eyecolorbrown',
    component: EyeColorTraitBrown
  }
];

export default function Traits(props) {
  return (
    <React.Fragment>
      <AnalysisSelector
        {...props}
        analyses={traits}
        category="Traits"
        categoryPath="/traits"
        dropdownText="Choose trait"
      />
      <Route
        path="/traits"
        exact
        render={() => (
          <div>
            <p>Explore genomic analyses for the following physical traits:</p>
            <ul>
              {traits.map(trait => (
                <li key={trait.route}>
                  <Link to={trait.route}>{trait.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </React.Fragment>
  );
}
