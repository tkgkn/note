import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './src/q1';
import './src/q2';
import CacheComp from './src/q3';
import Modal from './src/q4';

function ModalTest() {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setModalShow(true);
        }}
      >
        open modal
      </button>
      <Modal
        show={modalShow}
        onMounted={() => {
          console.log('mounted');
        }}
        onClosed={() => {
          console.log('closed');
        }}
        onClosing={() => {
          console.log('do closing');
        }}
      >
        this is content
      </Modal>
    </>
  );
}

ReactDOM.render(
  <div>
    <CacheComp />
    <ModalTest />
  </div>,
  document.getElementById('root')
);
