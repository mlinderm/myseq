import React from 'react';
import ReactDOM from 'react-dom';
import MySeq from './MySeq';

function create(elOrId, options) {
  const element = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
  if (!element) {
    throw new Error(`Attempted to create MySeq with non-existent element ${elOrId}`);
  }

  const defaultOptions = {
    embed: true,
  };

  ReactDOM.render(<MySeq options={Object.assign(defaultOptions, options)} />, element);
}

export default { create }; // eslint-disable-line import/prefer-default-export
