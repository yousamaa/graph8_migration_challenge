// components/shared/Logo.tsx
import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {}

const Logo: React.FC<LogoProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 28" {...props}>
    {/* Replace with your actual Logo SVG Path data */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20V8h2.5v12H10zm5.8-12h2.7v12h-2.7V8zm4.4 0h2.6v12h-2.6V8zm13.2 0l-4.1 12h-3l-4.1-12h3l2.6 8.2L29.2 8h3zm10.1 12V8h3.9c2.9 0 4.8 1.6 4.8 4.1 0 2.4-1.9 4.1-4.8 4.1h-3.9zm2.6-9.4h-.9c-1.2 0-1.9.8-1.9 2.1s.7 2.1 1.9 2.1h.9v-4.2zm10.6 9.4V8h2.7v12h-2.7zm11.3 0l-4.1 12h-3l-4.1-12h3l2.6 8.2 2.6-8.2h3zM70.9 8h2.6v12h-2.6V8zm4.4 0h2.6v12h-2.6V8zm11.2 0V20h-2.6V8h2.6zm8.5 0l2.6 8.2L100.1 8h3l-4.1 12h-3l-4.1-12h3zM104.1 8h2.6v12h-2.6V8zm8.8 12V8h3.9c2.9 0 4.8 1.6 4.8 4.1 0 2.4-1.9 4.1-4.8 4.1h-3.9zm2.6-9.4h-.9c-1.2 0-1.9.8-1.9 2.1s.7 2.1 1.9 2.1h.9v-4.2z"
    />
  </svg>
);

export default Logo;
