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

  return config;
};
