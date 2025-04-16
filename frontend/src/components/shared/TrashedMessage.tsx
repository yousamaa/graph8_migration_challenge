// components/shared/TrashedMessage.tsx
import React from "react";

interface TrashedMessageProps {
  children: React.ReactNode;
  onRestore: () => void;
  className?: string;
}

const TrashedMessage: React.FC<TrashedMessageProps> = ({
  children,
  onRestore,
  className = "",
}) => {
  return (
    <div
      className={`p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded flex items-center justify-between ${className}`}
    >
      <div className="flex items-center">
        {/* Optional: Add a warning icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {children}
      </div>
      <button
        onClick={onRestore}
        className="text-sm text-yellow-900 hover:underline font-medium"
        type="button"
      >
        Restore
      </button>
    </div>
  );
};

export default TrashedMessage;
