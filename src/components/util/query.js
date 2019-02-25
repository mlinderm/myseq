/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

/**
 * Helper function to provide a reference-aware variant query.
 *
 * Expects hg19/b37 position as `pos` property and hg38 position as `pos_h38`
 *
 * @param {VCFSource} source VCFSource to query
 * @param {Object} variant Variant query object
 * @param {Boolean} assumeRefRef Boolean passed through to query to return synthetic
 * ref/ref genotype if variant not found
 * @returns {VCFVariant} Variant object
 */
export function refAwareVariantQuery(source, variant, assumeRefRef = false) {
  return source.reference().then((reference) => {
    const { shortName } = reference;
    if (shortName === 'hg19' || shortName === 'b37') {
      const {
        ctg, pos, ref, alt,
      } = variant;
      return source.variant(ctg, pos, ref, alt, assumeRefRef);
    } else if (shortName === 'hg38') {
      const {
        ctg, pos_hg38: pos, ref, alt,
      } = variant;
      if (!pos) {
        throw new Error('Source uses hg38 but query is not defined for that reference genome');
      }
      return source.variant(ctg, pos, ref, alt, assumeRefRef);
    }
    throw new Error('Unable to obtain coordinates for current reference');
  });
}

export const variantPropType = PropTypes.shape({
  ctg: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  pos_hg38: PropTypes.number,
  ref: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
});
