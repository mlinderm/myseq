import React from 'react';
import { shallow } from 'enzyme';
import { LocalFileReader, TabixIndexedFile } from 'myseq-vcf';
import LoadVcfFile from './LoadVcfFile';
import { createTabixFileFromURL } from './TabixIndexedFileWorker';

jest.mock('./TabixIndexedFileWorker');
createTabixFileFromURL.mockReturnValue(
  new TabixIndexedFile(
    new LocalFileReader('./test-data/single_sample.vcf.gz'),
    new LocalFileReader('./test-data/single_sample.vcf.gz.tbi')
  )
);

describe('Initialize source from query parameters', () => {
  beforeEach(() => {
    createTabixFileFromURL.mockClear();
  });

  test('Initialize source from vcf parameter', () => {
    const sourceCallback = jest.fn();
    const settingsCallback = jest.fn();
    const load = shallow(
      <LoadVcfFile
        location={{ state: { from: { search: 'vcf=test&assumeRefRef=1' } } }}
        setSource={sourceCallback}
        updateSettings={settingsCallback}
      />
    );
    expect(createTabixFileFromURL).toBeCalledWith('test', 'test.tbi');
    expect(load.state('url')).toBe('test');
    expect(sourceCallback).toBeCalled();
    expect(settingsCallback).toBeCalledWith({ assumeRefRef: true });
  });

  test('Initialize source and index from vcf parameter', () => {
    shallow(
      <LoadVcfFile
        location={{ state: { from: { search: 'vcf=test&tbi=index' } } }}
        setSource={jest.fn()}
        updateSettings={jest.fn()}
      />
    );
    expect(createTabixFileFromURL).toBeCalledWith('test', 'index');
  });
});
