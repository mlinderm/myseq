import React from 'react';
import PropTypes from 'prop-types';

export const defaultSettings = {
  sample: undefined,
  assumeRefRef: false,
};

const SettingsContext = React.createContext({
  settings: defaultSettings,
});

export const settingsProps = {
  settings: PropTypes.shape({
    sample: PropTypes.string,
    assumeRefRef: PropTypes.bool,
  }),
};

export default SettingsContext;
