import React from "react";

const Textarea = ({ label, error, className = "", ...props }) => {
  return (
    <div
      className="
      form-field
    "
    >
      {label && (
        <label
          className="
          form-label
        "
        >
          {label}
        </label>
      )}

      <textarea
        className={`
          form-textarea
          ${error ? "error" : ""}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p
          className="
          form-error
        "
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
