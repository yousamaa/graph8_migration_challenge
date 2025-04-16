// components/shared/Dropdown.tsx
"use client"; // Needs client-side state for open/close

import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  children: React.ReactNode; // Trigger element
  dropdownContent: React.ReactNode;
  placement?: "bottom-end" | "bottom-start"; // Add more as needed
  className?: string;
  ariaLabel?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  dropdownContent,
  placement = "bottom-start",
  className,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placementClasses = placement === "bottom-end" ? "right-0" : "left-0";

  return (
    <div ref={dropdownRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {isOpen && (
        <div
          className={`absolute z-50 ${placementClasses} mt-2`}
          role="menu"
          aria-orientation="vertical"
          // aria-labelledby="options-menu" // Link this ID to the button if needed
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
