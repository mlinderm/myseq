# MySeq [![Build Status](https://travis-ci.org/mlinderm/myseq.svg?branch=master)](https://travis-ci.org/mlinderm/myseq)

MySeq is a web-application for privacy-protecting interactive analysis of personal genomes (distributed as compressed-and-indexed VCF files) inspired by [GENOtation (previously the Interpretome)](http://genotation.stanford.edu) and [DNA.LAND Compass](http://compass.dna.land). MySeq is intended for use as a genomics educational platform.

MySeq can load and analyze [Tabix-indexed](http://www.htslib.org/doc/tabix.html) [VCF](https://samtools.github.io/hts-specs/) files stored locally on the user's computer or available remotely. Queries and other analyses will only load the necessary blocks of the compressed VCF file, enabling efficient analysis of whole-genome-scale VCF files.

## Quick Start

MySeq is deployed at <https://go.middlebury.edu/myseq>. Get started by doing one of 1) selecting a local VCF file and its index file, 2) providing a URL to a VCF file, or 3) selecting one of the pre-configured VCF files ([Genome in a Bottle](https://jimb.stanford.edu/giab) variant calls for NA12878/HG001). Check out a [video](https://youtu.be/RhiWw6OeK7g) demonstrating MySeq's features with variant calls from NA12878.

As an example of using a public URL, you can load the 1000 Genomes chr22 variant calls directly from AWS S3 with the following URL (try querying for [rs72646967](https://www.ncbi.nlm.nih.gov/snp/rs72646967)):
```
https://s3.amazonaws.com/1000genomes/release/20130502/ALL.chr22.phase3_shapeit2_mvncall_integrated_v5a.20130502.genotypes.vcf.gz
```
Note that querying and parsing a VCF with this many samples can take a few moments.

Any third-party server must allow [cross-origin requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) so that the MySeq application can requests resources from a different domain (e.g. from S3). See <https://enable-cors.org> for guides to configuring your server to enable cross-origin resource sharing (CORS).

## API

MySeq analyses can be accessed by URL. All URLs accept the following query parameters:

| Parameter | Values |
| --------- | ------ |
| `vcf`     | URL of Tabix-indexed VCF |
| `tbi`     | URL of Tabix index file (if not specified, defaults to `vcf`.tbi) |
| `assumeRefRef` | 1 to assume a WGS VCF in which absent calls have homozygous reference genotypes |

in addition, the query path accepts a the following query parameters:

| Parameter | Values |
| --------- | ------ |
| `query`   | Comma-separated list of region, rsID or gene queries |

For example, the following links directly to query results in NA12878 (when running the development server)

<http://localhost:3000/query?vcf=https%3A%2F%2Fskylight.middlebury.edu%2F~mlinderman%2Fdata%2FNA12878.gatk-haplotype-annotated.vcf.gz&assumeRefRef=1&query=chr7%3A141673345%2C%20chr7%3A141672705%2C%20chr7%3A141672604>

or with the deployed application

<https://skylight.middlebury.edu/~mlinderman/myseq/query?vcf=https%3A%2F%2Fskylight.middlebury.edu%2F~mlinderman%2Fdata%2FNA12878.gatk-haplotype-annotated.vcf.gz&assumeRefRef=1&query=chr7%3A141673345%2C%20chr7%3A141672705%2C%20chr7%3A141672604>

The "bitter tasting" analysis [example](examples/bitter-tasting.html) includes additional examples of query parameters in use. That example further demonstrates embedding MySeq as an iframe, e.g.

```html
<iframe class="myseq" width=760 height=300 src="http://localhost:3000/query?vcf=https%3A%2F%2Fskylight.middlebury.edu%2F~mlinderman%2Fdata%2FNA12878.gatk-haplotype-annotated.vcf.gz&assumeRefRef=1&query=chr7%3A141673345%2C%20chr7%3A141672705%2C%20chr7%3A141672604"></iframe>
```

to create an online tutorial.

## Deployment

MySeq is implemented with [Create React App (CRA)](https://facebook.github.io/create-react-app/) and can be deployed via one of the [CRA-suggested approaches](https://facebook.github.io/create-react-app/docs/deployment). Note that MySeq uses client-side routing and so you will need to configure the server to serve `index.html` for unknown paths as described in the [CRA documentation](https://facebook.github.io/create-react-app/docs/deployment#serving-apps-with-client-side-routing). At present MySeq is configured with a specific homepage. You will need to update the `homepage` property in [package.json](package.json) to point to your deployed homepage.

## Development

MySeq is implemented with [Create React App (CRA)](https://facebook.github.io/create-react-app/) and so supports CRA's `start`, `test` and `build` scripts. In addition ESLint can be run with the `npm run lint` package script.

## Acknowledgements

MySeq incorporates icons adapted from Font Awesome Free under a [CC BY 4.0 license](https://fontawesome.com/license/free).
