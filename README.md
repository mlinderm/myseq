# MySeq [![Build Status](https://travis-ci.org/mlinderm/myseq.svg?branch=master)](https://travis-ci.org/mlinderm/myseq)

MySeq is a web-application for interactive analysis of personal genomes (distributed as compressed-and-indexed VCF files) inspired by the [Interpretome](http://www.interpretome.com) and [DNA.LAND Compass](http://compass.dna.land). MySeq is ultimately intended for use as a genomics educational platform.

MySeq can load and analyze [Tabix-indexed](http://www.htslib.org/doc/tabix.html) [VCF](https://samtools.github.io/hts-specs/) files stored locally on the user's computer or available remotely. Queries and other analyses will only load the necessary blocks of the compressed VCF file, enabling efficient analysis of whole-genome-scale VCF files.

## API

MySeq analyses can be accessed by URL. All URLs accept the following query parameters:

| Parameter | Values |
| --------- | ------ |
| `vcf`     | URL of tabix-indexed VCF |
| `tbi`     | URL of Tabix index file (if not specified, defaults to `vcf`.tbi) |
| `assumeRefRef` | 1 to assume a WGS VCF in which absent calls have homozygous reference genotypes |

in addition, the query path accepts a the following query parameters:

| Parameter | Values |
| --------- | ------ |
| `query`   | Comma-separated list of region, rsID or gene queries |

The "bitter tasting" analysis [example](examples/bitter-tasting.html) demonstrates the use of query parameters.

```html
<iframe class="myseq" width=760 height=300 src="http://localhost:3000/query?vcf=https%3A%2F%2Fskylight.middlebury.edu%2F~mlinderman%2Fdata%2FNA12878.gatk-haplotype-annotated.vcf.gz&assumeRefRef=1&query=chr7%3A141673345%2C%20chr7%3A141672705%2C%20chr7%3A141672604"></iframe>
```
## Development

MySeq is implemented with [Create React App (CRA)](https://github.com/facebook/create-react-app) and so supports CRA's `start`, `test` and `build` scripts. In addition ESLint can be run with the `npm run lint` package script.

## Acknowledgements

MySeq incorporates icons adapted from Font Awesome Free under a [CC BY 4.0 license](https://fontawesome.com/license/free).
