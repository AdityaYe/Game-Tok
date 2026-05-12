import React from "react";

import useToastStore from "../../store/toastStore";

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      className="
      toast-container
    "
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            toast
            toast-${toast.type}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
