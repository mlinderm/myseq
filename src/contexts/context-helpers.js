/* eslint-disable import/prefer-default-export */
import React from 'react';
import SettingsContext from './SettingsContext';
import SourceContext from './SourceContext';

export function withSourceAndSettings(Component) {
  return function SourceAndSettingsComponent(props) {
    return (
      <SettingsContext.Consumer>
        {settings => (
          <SourceContext.Consumer>
            {source => (
              <Component settings={settings} source={source} {...props} />
            )}
          </SourceContext.Consumer>
        )}
      </SettingsContext.Consumer>
    );
  };
}
