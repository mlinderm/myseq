/* eslint-disable import/prefer-default-export */
const flip = {
  a: 't', A: 'T', c: 'g', C: 'G', g: 'c', G: 'C', t: 'a', T: 'A',
};

export function flipStrand(genotype) {
  let flipped = '';
  for (let i = 0; i < genotype.length; i += 1) {
    const allele = genotype[i];
    // TODO: Handle symbolic and other alleles
    flipped += flip[allele] || allele;
  }
  return flipped;
}
