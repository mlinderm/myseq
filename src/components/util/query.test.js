import { VCFVariant, Ref } from 'myseq-vcf';
import { refAwareVariantQuery } from './query';

jest.mock('myseq-vcf');

const b37Variant = new VCFVariant('9\t22134094\trs10811661\tT\tC\t.\tPASS\t.\tGT\t1/1', ['NA12878']);
const hg38Variant = new VCFVariant('chr9\t22134095\trs10811661\tT\tC\t.\tPASS\t.\tGT\t1/1', ['NA12878']);
const variant = {
  ctg: '9', pos: 22134094, pos_hg38: 22134095, ref: 'T', alt: 'C',
};

describe('Reference aware query helper', () => {
  let mockVCFSource;
  describe('Reference is b37', () => {
    beforeEach(() => {
      mockVCFSource = {
        reference: jest.fn(() => Promise.resolve(Ref.b37Reference)),
        variant: jest.fn(() => Promise.resolve(b37Variant)),
      };
    });

    test('Invokes variants with correct position', async () => {
      await expect(refAwareVariantQuery(mockVCFSource, variant, false))
        .resolves.toEqual(b37Variant);
      expect(mockVCFSource.variant).toHaveBeenCalledWith('9', 22134094, 'T', 'C', false);
    });

    test('Passes assumeRefRef', async () => {
      await expect(refAwareVariantQuery(mockVCFSource, variant, true))
        .resolves.toEqual(b37Variant);
      expect(mockVCFSource.variant).toHaveBeenCalledWith('9', 22134094, 'T', 'C', true);
    });
  });

  describe('Reference is hg19', () => {
    beforeEach(() => {
      mockVCFSource = {
        reference: jest.fn(() => Promise.resolve(Ref.hg19Reference)),
        variant: jest.fn(() => Promise.resolve(b37Variant)),
      };
    });

    test('Invokes variants with correct position', async () => {
      await expect(refAwareVariantQuery(mockVCFSource, variant, false))
        .resolves.toEqual(b37Variant);
      expect(mockVCFSource.variant).toHaveBeenCalledWith('9', 22134094, 'T', 'C', false);
    });
  });

  describe('Reference is hg38', () => {
    beforeEach(() => {
      mockVCFSource = {
        reference: jest.fn(() => Promise.resolve(Ref.hg38Reference)),
        variant: jest.fn(() => Promise.resolve(hg38Variant)),
      };
    });

    test('Invokes variants with correct position', async () => {
      await expect(refAwareVariantQuery(mockVCFSource, variant, false))
        .resolves.toEqual(hg38Variant);
      expect(mockVCFSource.variant).toHaveBeenCalledWith('9', 22134095, 'T', 'C', false);
    });

    test('Passes assumeRefRef', async () => {
      await expect(refAwareVariantQuery(mockVCFSource, variant, true))
        .resolves.toEqual(hg38Variant);
      expect(mockVCFSource.variant).toHaveBeenCalledWith('9', 22134095, 'T', 'C', true);
    });

    test('Rejects if there hg38 coordinates are not supplied', async () => {
      const { pos_hg38, ...variant_noHg38 } = variant; // eslint-disable-line
      // TODO: Include more specific error matcher
      await expect(refAwareVariantQuery(mockVCFSource, variant_noHg38, false))
        .rejects.toBeInstanceOf(Error);
    });
  });
});
