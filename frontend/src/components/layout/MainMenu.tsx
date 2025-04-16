// components/layout/MainMenu.tsx
"use client"; // Needs access to pathname

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/shared/Icon"; // Adjust path if needed

interface MainMenuProps {
  className?: string;
}

const MainMenu: React.FC<MainMenuProps> = ({ className }) => {
  const pathname = usePathname();

  const isUrl = (...urls: string[]) => {
    return urls.some((url) => pathname.startsWith(url));
  };

  const menuItems = [
    { label: "Dashboard", icon: "dashboard", href: "/dashboard" }, // Need dashboard icon
    { label: "Organizations", icon: "office", href: "/organizations" }, // Need office icon
    { label: "Contacts", icon: "users", href: "/contacts" }, // Need users icon
    // Add 'Reports' if needed
  ];

  // Placeholder icons - replace with actual Icon names or SVGs
  const icons: { [key: string]: React.ReactNode } = {
    dashboard: <path d="M10 20V8h2.5v12H10z" />, // Placeholder
    office: <path d="M10 20V8h2.5v12H10z" />, // Placeholder
    users: <path d="M10 20V8h2.5v12H10z" />, // Placeholder
  };

  const CustomIcon = ({ name }: { name: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="w-4 h-4 mr-2 fill-current"
    >
      {icons[name]}
    </svg>
  );

  return (
    <div className={className}>
      {menuItems.map(({ label, icon, href }) => (
        <Link
          key={label}
          href={href}
          className={`group flex items-center py-3 ${
            isUrl(href) ? "text-white" : "text-indigo-300 hover:text-white"
          }`}
        >
          {/* Replace CustomIcon with your actual Icon component if it handles these names */}
          {/* <Icon name={icon as any} className={`mr-2 h-4 w-4 ${isUrl(href) ? 'fill-white' : 'fill-indigo-400 group-hover:fill-white'}`} /> */}
          <CustomIcon name={icon} />
          {label}
        </Link>
      ))}
    </div>
  );
};

export default MainMenu;
