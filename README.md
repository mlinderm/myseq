# MySeq [![Build Status](https://travis-ci.org/mlinderm/myseq.svg?branch=master)](https://travis-ci.org/mlinderm/myseq)

MySeq is a web-application for interactive analysis of personal genomes (distributed as compressed-and-indexed VCF files) inspired by the [Interpretome](http://www.interpretome.com) and [DNA.LAND Compass](http://compass.dna.land). MySeq is ultimately intended for use as a genomics educational platform.

MySeq can load and analyze [Tabix-indexed](http://www.htslib.org/doc/tabix.html) [VCF](https://samtools.github.io/hts-specs/) files stored locally on the user's computer or available remotely. Queries and other analyses will only load the necessary blocks of the compressed VCF file, enabling efficient analysis whole-genome-scale VCF files.

## Development

MySeq is implemented with [Create React App (CRA)](https://github.com/facebook/create-react-app) and so supports CRA's `start`, `test` and `build` scripts. In addition ESLint can be run with the `npm run lint` package script.

## Acknowledgements

MySeq incorporates icons adapted from Font Awesome Free under a [CC BY 4.0 license](https://fontawesome.com/license/free).
