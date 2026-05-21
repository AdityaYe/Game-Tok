import React from "react";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

const FadeIn = ({ children, delay = 0, y = 20 }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
