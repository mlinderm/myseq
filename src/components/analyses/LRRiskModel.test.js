import React from 'react';
import { mount } from 'enzyme';
import { waitForState } from 'enzyme-async-helpers';
import {
  VCFSource,
  VCFVariant,
  TabixIndexedFile,
  LocalFileReader
} from 'myseq-vcf';

import { defaultSettings } from '../../contexts/SettingsContext';
import { LRRiskModelImpl as LRRiskModel } from './LRRiskModel';

const mockVariant = jest.fn();

const mockVCFSource = new VCFSource(
  new TabixIndexedFile(
    new LocalFileReader('./test-data/single_sample.vcf.gz'),
    new LocalFileReader('./test-data/single_sample.vcf.gz.tbi')
  )
);
mockVCFSource.variant = mockVariant;

const riskVariants = [
  {
    variant: {
      ctg: '4',
      pos: 6292915,
      ref: 'A',
      alt: 'G'
    },
    rsId: 'rs10010131',
    LR: { 'A/A': 1.134, 'A/G': 1.013, 'G/G': 0.904 }
  },
  {
    variant: {
      ctg: '9',
      pos: 22134094,
      ref: 'T',
      alt: 'C'
    },
    rsId: 'rs10811661',
    LR: { 'T/T': 1.059, 'T/C': 0.883, 'C/C': 0.736 }
  }
];

const vcfVariants = [
  new VCFVariant('4\t6292915\trs10010131\tA\tG\t.\tPASS\t.\tGT\t0/1', [
    'NA12878'
  ]),
  new VCFVariant('9\t6292915\trs10811661\tT\tC\t.\tPASS\t.\tGT\t1/1', [
    'NA12878'
  ])
];

describe('Liklihood Ratio Model', () => {
  beforeEach(() => {
    mockVariant.mockClear();
    mockVariant
      .mockImplementationOnce(() => Promise.resolve(vcfVariants[0]))
      .mockImplementationOnce(() => Promise.resolve(vcfVariants[1]));
  });

  test('Compute cumulative LR from variants', () => {
    const lr = mount(
      <LRRiskModel
        settings={defaultSettings}
        source={mockVCFSource}
        riskVariants={riskVariants}
        title="Test disease"
        preTestRisk={0.25}
      >
        Description
      </LRRiskModel>
    );
    return waitForState(lr, state => state.riskVariants.length > 0).then(() => {
      const cumulativeLR = 1.013 * 0.736;
      expect(lr.state('cumulativeLR')).toBe(cumulativeLR);

      lr.update();

      const postTestOdds = (0.25 / (1 - 0.25)) * cumulativeLR;
      const postTestRisk = postTestOdds / (1 + postTestOdds);
      expect(
        lr.contains(
          <span className="risk-pct">
            {postTestRisk.toLocaleString(undefined, {
              style: 'percent',
              maximumFractionDigits: 1
            })}
          </span>
        )
      ).toBe(true);
    });
  });
});
