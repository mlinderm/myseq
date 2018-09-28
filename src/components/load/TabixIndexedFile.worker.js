import registerPromiseWorker from 'promise-worker/register';
import { LocalFileReader, RemoteFileReader, TabixIndexedFile } from 'myseq-vcf';

// TabixIndexedFile owned by the worker
let tabixFile;

self.addEventListener('message', (event) => { // eslint-disable-line no-restricted-globals
  const { kind, data } = event.data;
  if (kind === 'construct-url') {
    tabixFile = new TabixIndexedFile(
      new RemoteFileReader(data.variant),
      new RemoteFileReader(data.index),
    );
  } else if (kind === 'construct-file') {
    tabixFile = new TabixIndexedFile(
      new LocalFileReader(data.variant),
      new LocalFileReader(data.index),
    );
  }
});

// Use promise worker to maintain per-message post and response link for
// TabixIndexedFile methods
registerPromiseWorker((message) => {
  if (!tabixFile) {
    throw new Error('TabixFile not yet initialized');
  }
  const { kind, data } = message;
  switch (kind) {
    default:
      throw new Error('Unsupported operation on TabixIndexFile');
    case 'header':
      return tabixFile.header();
    case 'records':
      return tabixFile.records(data.ctg, data.pos, data.end);
  }
});
