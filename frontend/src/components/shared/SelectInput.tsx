// components/shared/SelectInput.tsx
import React from "react";

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  errors?: string | string[];
  wrapperClassName?: string;
  children: React.ReactNode; // Expect <option> elements
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  errors,
  wrapperClassName = "",
  className = "form-select", // Use the class defined in globals.css
  children,
  ...props
}) => {
  const error = Array.isArray(errors) ? errors[0] : errors;

  return (
    <div className={wrapperClassName}>
      <label className="block font-medium text-sm text-gray-700" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`${className} ${error ? "border-red-500" : ""}`}
        {...props}
      >
        {children}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default SelectInput;
