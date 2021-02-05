import React, { FC, ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
}

//!Form for uploading files will be inside modal so we can create this component and just use it UploadImagesModal component which we’ll create later. Also modal will use createPortal method from react-dom to append modal in another div in index.html file, and not in #root div. So we can add new div with id #modal-root to index.html file in public folder. You can add this div before or after #root div.

const Modal: FC<ModalProps> = ({ onClose, title, children }) => {
  const targetEl = document.getElementById("modal-root");

  const modal = (
    <div className="modal">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot">
          <button className="button" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );

  return targetEl ? ReactDOM.createPortal(modal, targetEl) : modal;
};

export default Modal;
