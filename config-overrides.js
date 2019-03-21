/* eslint-disable no-param-reassign */
const path = require('path');

module.exports = function override(config) {
  // Adapted from:
  // https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
  // https://github.com/arackaf/customize-cra
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  });

  // Note: Here is a side effect.
	// @see https://github.com/webpack/webpack/issues/6642#issuecomment-370222543
	const { output } = config;
	output.globalObject = 'this';

  return config;
};
