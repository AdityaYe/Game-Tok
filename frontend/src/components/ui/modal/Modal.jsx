import React, { useEffect } from "react";

import ReactDOM from "react-dom";

import "../../../styles/modal.css";

const Modal = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="
        modal-overlay
      "
      onClick={onClose}
    >
      <div
        className="
          modal-content
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,

    document.body,
  );
};

export default Modal;
