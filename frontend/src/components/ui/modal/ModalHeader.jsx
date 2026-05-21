import React from "react";

const ModalHeader = ({ title, onClose }) => {
  return (
    <div
      className="
      modal-header
    "
    >
      <h2>{title}</h2>

      <button onClick={onClose}>✕</button>
    </div>
  );
};

export default ModalHeader;
