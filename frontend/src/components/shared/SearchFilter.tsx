// components/shared/SearchFilter.tsx
"use client"; // Needs state for internal input value if not fully controlled

import React, { useState, useEffect } from "react";

interface SearchFilterProps {
  value: string | null; // Controlled search value
  onUpdateValue: (value: string) => void; // Update parent state
  onReset: () => void;
  children: React.ReactNode; // For the dropdown slot
  className?: string;
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onUpdateValue,
  onReset,
  children,
  className = "",
  placeholder = "Search...",
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  // Update internal state if controlled value changes from outside
  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onUpdateValue(newValue); // Immediately notify parent
  };

  const handleReset = () => {
    setInternalValue("");
    onReset(); // Call parent reset logic
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex w-full bg-white rounded shadow">
        {/* Search Input */}
        <input
          className="relative w-full px-6 py-3 rounded-r focus:outline-none focus:ring-2 focus:ring-indigo-400 border-l-0"
          autoComplete="off"
          type="text"
          name="search"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
        />
        {/* Reset Button (optional, could be outside) */}
        {/* <button onClick={handleReset} type="button" className="ml-3 text-sm text-gray-600 hover:text-gray-800 focus:text-indigo-500">Reset</button> */}

        {/* Dropdown/Filter Slot - Simple placement for now */}
        <div className="ml-4">{children}</div>
      </div>
      <button
        onClick={handleReset}
        type="button"
        className="ml-3 text-sm text-gray-600 hover:text-gray-800 focus:text-indigo-500"
      >
        Reset
      </button>
    </div>
  );
};

export default SearchFilter;
