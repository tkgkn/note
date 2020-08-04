import React from 'react';
import ReactDOM from 'react-dom';
import './src/q1';
import './src/q2';
import CacheComp from './src/q3';
import Modal from './src/q4';

ReactDOM.render(
  <div>
    <CacheComp />
    <Modal show={false} />
  </div>,
  document.getElementById('root')
);
