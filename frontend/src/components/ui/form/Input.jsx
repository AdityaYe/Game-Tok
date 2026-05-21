import React from "react";

const Input = ({ label, error, className = "", ...props }) => {
  const inputId = props.id || props.name;
  return (
    <div
      className="
      form-field
    "
    >
      {label && (
        <label
          className="
          form-label"
          htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        className={`
          form-input
          ${error ? "error" : ""}
          ${className}
        `} id={inputId}
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

export default Input;
