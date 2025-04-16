// components/shared/Icon.tsx
import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: "cheveron-down" | "cheveron-right" | "trash" | "menu"; // Add other icon names as needed
}

const icons = {
  "cheveron-down": (
    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
  ),
  "cheveron-right": (
    <path
      d="M10.707 17.707l.707-.707-5.657-5.657 5.657-5.657-.707-.707L4.343 11.343z"
      transform="scale(-1, 1) translate(-20, 0)"
    />
  ), // Flipped horizontally
  trash: (
    <path d="M5 4h10v2H5V4zm2 14h6V7H7v11zm7-14a1 1 0 011-1h2a1 1 0 011 1v2H4V4a1 1 0 011-1h2a1 1 0 011 1V2a2 2 0 012-2h2a2 2 0 012 2v2z" />
  ),
  menu: <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />,
};

const Icon: React.FC<IconProps> = ({
  name,
  className = "w-6 h-6",
  ...props
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20" // Adjust viewBox if needed per icon
    {...props}
  >
    {icons[name]}
  </svg>
);

export default Icon;
