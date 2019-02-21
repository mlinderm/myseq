/* eslint-disable no-param-reassign */
const path = require('path');

module.exports = function override(config) {
  if (process.env.npm_lifecycle_script.includes('embed')) {
    config.output.library = 'myseq';
    config.output.libraryTarget = 'umd';
    config.output.umdNamedDefine = true;
    config.output.libraryExport = 'default';

    /**
     * Change the webpack entry and output path
     */
    config.entry = path.resolve('src/index-embed.js');
    config.output.filename = 'myseq-embed.js';
    config.output.path = path.resolve('build');
  }

  // Adapted from:
  // https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  });


  return config;
};
