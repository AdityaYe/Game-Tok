import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, loading, className = "", ...props }) => {
  return (
    <motion.button
      whileTap={{
        scale: 0.96,
      }}
      whileHover={{
        scale: 1.02,
      }}
      aria-busy={loading}
      className={`
    form-button
    ${className}
  `}
      disabled={loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </motion.button>
  );
};

export default Button;
