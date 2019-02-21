import PromiseWorker from 'promise-worker';
import TabixWorker from './TabixIndexedFile.worker';

/**
 * Proxy class for creating TabixIndexedFile in web worker
 *
 * Offloads compute intensive parsing and query operations from main thread
 */
class TabixIndexedFileWorker {
  constructor(worker) {
    this.worker = new PromiseWorker(worker);
  }

  /**
   * Return header from Tabix Indexed File
   * @return {Array<string>} Array of header lines
   */
  header() {
    return this.worker.postMessage({ kind: 'header' });
  }

  /**
   * Return records in genomic ranges
   * @param  {string} ctg Conting
   * @param  {number} pos Inclusive start coordinate (1-indexed)
   * @param  {number} end Inclusive end coordinate (1-indexed)
   * @return {Array<string>} Array of record lines
   */
  records(ctg, pos, end) {
    return this.worker.postMessage({
      kind: 'records',
      data: { ctg, pos, end },
    }).catch((err) => {
      if (err.message.startsWith('Unknown contig')) {
        // Since Error can't be cloned we lose the custom error classes, specifically
        // ContigNotInIndexError. Match on message to convert to empty array.
        return [];
      }
      throw err;
    });
  }
}

function createTabixFileWorker(kind, variant, index) {
  const worker = new TabixWorker();
  worker.postMessage({ kind, data: { variant, index } });
  return new TabixIndexedFileWorker(worker);
}

/**
 * Create TabixIndexedFile proxy for remote VCF file
 * @param  {string} variantURL URL for compressed and index VCF file
 * @param  {string} indexURL   URL for Tabix index file
 * @return {TabixIndexedFileWorker} Proxy for TabixIndexedFile
 */
export function createTabixFileFromURL(variantURL, indexURL) {
  return createTabixFileWorker('construct-url', variantURL, indexURL);
}

/**
 * Create TabixIndexedFile proxy for local VCF file
 * @param  {string} variantFile File object for compressed and index VCF file
 * @param  {string} indexFile   File object for Tabix index file
 * @return {TabixIndexedFileWorker} Proxy for TabixIndexedFile
 */
export function createTabixFileFromFile(variantFile, indexFile) {
  return createTabixFileWorker('construct-file', variantFile, indexFile);
}
