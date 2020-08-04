import React, { useState, useEffect } from 'react';
import './q4.css';

type defaultPropsType = typeof Modal.defaultProps;

interface Props extends defaultPropsType {
  show: boolean;
}

function Modal(props: React.PropsWithChildren<Props>) {
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    console.log(props.show);
    setShow(props.show);
  }, [props.show]);

  useEffect(() => {
    props.onMounted && props.onMounted();
    return props.onClosed;
  }, []);

  return (
    <div
      className="mask"
      style={{
        visibility: show ? 'visible' : 'hidden'
      }}
    >
      <div className="modal">
        <p>{props.children}</p>
        <div className="buttons">
          <button
            onClick={() => {
              props.onClosing && props.onClosing();
              setShow(false);
            }}
          >
            {props.closeBtnTxt}
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.defaultProps = {
  hasMask: false,
  closeBtnTxt: '关闭',
  onClosing: () => {},
  onMounted: () => {},
  onClosed: () => {}
};

export default Modal;
