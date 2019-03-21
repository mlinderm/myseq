import React from 'react';
import PropTypes from 'prop-types';

export const defaultSettings = {
  sample: undefined,
  assumeRefRef: false,
  external: true
};

const SettingsContext = React.createContext({
  settings: defaultSettings
});

export const settingsPropType = PropTypes.shape({
  sample: PropTypes.string,
  assumeRefRef: PropTypes.bool,
  external: PropTypes.bool
});

export function withSettings(Component) {
  return function SettingsComponent(props) {
    return (
      <SettingsContext.Consumer>
        {settings => <Component settings={settings} {...props} />}
      </SettingsContext.Consumer>
    );
  };
}

export default SettingsContext;
