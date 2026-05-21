import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "focus-trap-react";
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
    <AnimatePresence>
      <FocusTrap>
      {isOpen && (
        <motion.div
          className="
          modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <motion.div
            className="
            modal-content
          "
            onClick={(e) => e.stopPropagation()}
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
      </FocusTrap>
    </AnimatePresence>,

    document.body,
  );
};

export default Modal;
