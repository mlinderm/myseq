const Environment = require('jest-environment-jsdom');

/**
 * A custom environment to set the TextDecoder that is required by myseq-vcf. Adapted
 * from: https://stackoverflow.com/a/57713960
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
  }
};
