import React from 'react';
import { shallow } from 'enzyme';
import { VCFSource, TabixIndexedFile, LocalFileReader } from 'myseq-vcf';
import { waitForState } from 'enzyme-async-helpers';

import VariantQuery, { CoordinateSearchBoxImpl } from './VariantQuery';

describe('CoordinateSearchBox', () => {
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
    source = new VCFSource(
      new TabixIndexedFile(
        new LocalFileReader('./test-data/single_sample.vcf.gz'),
        new LocalFileReader('./test-data/single_sample.vcf.gz.tbi')
      )
    );
  });

  describe('rsId queries', () => {
    beforeEach(() => {
      global.fetch.mockResponseOnce(
        JSON.stringify({
          total: 1,
          hits: [
            {
              dbsnp: { chrom: '7', hg19: { start: 141672604, end: 141672604 } },
              dbnsfp: { chrom: '7', hg38: { end: 141972804, start: 141972804 } }
            }
          ]
        })
      );
    });

    test('Uses MyVariantInfo to obtain hg19/b37 coordiantes for rsIDs', () => {
      const search = shallow(
        <CoordinateSearchBoxImpl
          coordinateQuery={jest.fn()}
          source={source}
          settings={{ external: true }}
          error={false}
          helpMessage=""
        />
      );
      return search
        .instance()
        .handleQuery('rs10246939')
        .then(query => {
          expect(query).toBe('7:141672604-141672604');
          expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    test('Uses MyVariantInfo to obtain hg38 coordiantes for rsIDs', () => {
      source = new VCFSource(
        new TabixIndexedFile(
          new LocalFileReader('./test-data/single_sample.hg38.vcf.gz'),
          new LocalFileReader('./test-data/single_sample.hg38.vcf.gz.tbi')
        )
      );
      const search = shallow(
        <CoordinateSearchBoxImpl
          coordinateQuery={jest.fn()}
          source={source}
          settings={{ external: true }}
          error={false}
          helpMessage=""
        />
      );
      return search
        .instance()
        .handleQuery('rs10246939')
        .then(query => {
          expect(query).toBe('7:141972804-141972804');
          expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('gene queries', () => {
    beforeEach(() => {
      global.fetch.mockResponseOnce(
        JSON.stringify({
          total: 1,
          hits: [
            {
              genomic_pos: { chr: '17', start: 43044295, end: 43170245 },
              genomic_pos_hg19: { chr: '17', start: 41196312, end: 41277500 }
            }
          ]
        })
      );
    });

    test('Uses MyGeneInfo to obtain coordiantes for genes', () => {
      const search = shallow(
        <CoordinateSearchBoxImpl
          coordinateQuery={jest.fn()}
          source={source}
          settings={{ external: true }}
          error={false}
          helpMessage=""
        />
      );
      return search
        .instance()
        .handleQuery('BRCA1')
        .then(query => {
          expect(query).toBe('17:41196312-41277500');
          expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });

    test('Uses MyGeneInfo to obtain coordiantes for genes', () => {
      source = new VCFSource(
        new TabixIndexedFile(
          new LocalFileReader('./test-data/single_sample.hg38.vcf.gz'),
          new LocalFileReader('./test-data/single_sample.hg38.vcf.gz.tbi')
        )
      );
      const search = shallow(
        <CoordinateSearchBoxImpl
          coordinateQuery={jest.fn()}
          source={source}
          settings={{ external: true }}
          error={false}
          helpMessage=""
        />
      );
      return search
        .instance()
        .handleQuery('BRCA1')
        .then(query => {
          expect(query).toBe('17:43044295-43170245');
          expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });
  });

  test('Does not make any requests for coordinate queries', () => {
    const search = shallow(
      <CoordinateSearchBoxImpl
        coordinateQuery={jest.fn()}
        source={source}
        settings={{ external: true }}
        error={false}
        helpMessage=""
      />
    );
    return search
      .instance()
      .handleQuery('7:141672604-141672604')
      .then(query => {
        expect(query).toBe('7:141672604-141672604');
        expect(global.fetch).toHaveBeenCalledTimes(0);
      });
  });

  test('Does not make any external requests when prohibited by settings', () => {
    // To match on error: https://github.com/facebook/jest/issues/3601
    expect.assertions(1);
    const search = shallow(
      <CoordinateSearchBoxImpl
        coordinateQuery={jest.fn()}
        source={source}
        settings={{ external: false }}
        error={false}
        helpMessage=""
      />
    );
    return expect(
      search.instance().handleQuery('rs10246939')
    ).rejects.toMatchObject({
      message: expect.stringMatching(/external/)
    });
  });
});

describe('VariantQuery component', () => {
  let source;
  beforeEach(() => {
    // File should have single variant chr1:100A>T
    source = new VCFSource(
      new TabixIndexedFile(
        new LocalFileReader('./test-data/single_sample.vcf.gz'),
        new LocalFileReader('./test-data/single_sample.vcf.gz.tbi')
      )
    );
  });

  test('Normalize and union query', () => {
    const query = shallow(<VariantQuery source={source} />);
    query.instance().handleCoordinateQuery(['7:1-1', '1:100', '7:1-10']);
    return waitForState(
      query,
      state => state.region && state.variants.length > 0
    ).then(() => {
      expect(query.state('region')).toBe('chr1:100-100, chr7:1-10');
      expect(query.state('error')).toBe(false);
      expect(query.state('variants')).toHaveLength(1);
    });
  });
});
