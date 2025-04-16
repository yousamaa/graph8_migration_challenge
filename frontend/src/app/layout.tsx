// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google"; // Example font
import "./globals.css"; // Import Tailwind styles

import Logo from "@/components/shared/Logo";
import Dropdown from "@/components/shared/Dropdown";
import Icon from "@/components/shared/Icon";
import MainMenu from "@/components/layout/MainMenu";
import Header from "@/components/layout/Header";
// Import FlashMessages component when created

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Ping CRM Clone",
    default: "Ping CRM Clone",
  },
  description: "A Next.js frontend for the Ping CRM clone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mobileMenuDropdownContent = (
    <div className="mt-2 rounded-sm bg-indigo-800 px-8 py-4 shadow-lg">
      <MainMenu />
    </div>
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Mimic structure from Main.vue */}
        <div id="dropdown" /> {/* Placeholder for potential portal target */}
        <div className="md:flex md:flex-col">
          <div className="md:flex md:h-screen md:flex-col">
            {/* Top Header Bar */}
            <div className="md:flex md:shrink-0">
              {/* Logo Section */}
              <div className="flex items-center justify-between bg-indigo-900 px-6 py-4 md:w-56 md:shrink-0 md:justify-center">
                <Link href="/" aria-label="Home" className="mt-1">
                  <Logo className="fill-white" width="120" height="28" />
                </Link>
                {/* Mobile Menu Button */}
                <Dropdown
                  className="md:hidden"
                  placement="bottom-end"
                  ariaLabel="Main menu"
                  dropdownContent={mobileMenuDropdownContent}
                >
                  <Icon name="menu" className="h-6 w-6 fill-white" />
                </Dropdown>
              </div>
              {/* User/Account Section */}
              <Header />
            </div>
            {/* Main Content Area */}
            <div className="md:flex md:grow md:overflow-hidden">
              {/* Sidebar Menu */}
              <MainMenu className="hidden w-56 shrink-0 overflow-y-auto bg-indigo-800 p-12 md:block" />
              {/* Page Content */}
              <div className="px-4 py-8 md:flex-1 md:overflow-y-auto md:p-12">
                {" "}
                {/* removed scroll-region */}
                {/* <FlashMessages /> */} {/* Add Flash/Toast messages here */}
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
