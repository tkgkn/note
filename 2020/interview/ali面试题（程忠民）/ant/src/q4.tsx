import React, { useState } from 'react';

type defaultPropsType = typeof Modal.defaultProps;

interface Props extends defaultPropsType {
  show: boolean;
  hasMask: boolean;
}

function Modal(props: React.PropsWithChildren<Props>) {
  const [show, setShow] = useState(props.show);
  return (
    <div>
      <p>{props.children}</p>
      <button
        onClick={() => {
          setShow(false);
        }}
      >
        close
      </button>
    </div>
  );
}

Modal.defaultProps = {
  hasMask: false
};

export default Modal;
