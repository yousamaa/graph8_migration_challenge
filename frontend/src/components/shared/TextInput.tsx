// components/shared/TextInput.tsx
import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string | string[]; // Adjust based on how errors are handled
  wrapperClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  errors,
  wrapperClassName = "",
  className = "form-input", // Use the class defined in globals.css
  ...props
}) => {
  const error = Array.isArray(errors) ? errors[0] : errors; // Simple handling

  return (
    <div className={wrapperClassName}>
      <label className="block font-medium text-sm text-gray-700" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`${className} ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default TextInput;
