import React from 'react';
import { mount } from 'enzyme';
import { VCFSource, TabixIndexedFile, LocalFileReader, VCFVariant } from 'myseq-vcf';
import { waitForState } from 'enzyme-async-helpers';

import { VariantDetailImpl } from './VariantDetail';

describe('VariantQuery component', () => {
  let _fetch; // eslint-disable-line no-underscore-dangle
  beforeAll(() => {
    _fetch = global.fetch;
    global.fetch = require('jest-fetch-mock'); // eslint-disable-line global-require
  });

  afterAll(() => {
    global.fetch = _fetch;
  });

  let source;
  beforeEach(() => {
    global.fetch.mockReset();
    // File should have hg19 reference
    source = new VCFSource(new TabixIndexedFile(
      new LocalFileReader('./test-data/single_sample.vcf.gz'),
      new LocalFileReader('./test-data/single_sample.vcf.gz.tbi'),
    ));
  });

  test('Does not make query for hg38 reference', () => {
    source = new VCFSource(new TabixIndexedFile(
      new LocalFileReader('./test-data/single_sample.hg38.vcf.gz'),
      new LocalFileReader('./test-data/single_sample.hg38.vcf.gz.tbi'),
    ));
    const variant = new VCFVariant('chr1\t100\t.\tA\tT\t.\t.\t.');

    const detail = mount(<VariantDetailImpl
      variant={variant}
      close={jest.fn()}
      source={source}
      settings={{ external: true }}
    />);
    // Test the unwrapped component:
    // https://github.com/airbnb/enzyme/issues/431
    return waitForState(detail, state => !!state.helpMessage)
      .then(() => {
        expect(detail.state('detail')).toBe(undefined);
      });
  });
});
