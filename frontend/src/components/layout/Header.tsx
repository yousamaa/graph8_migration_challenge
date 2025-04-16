// components/layout/Header.tsx
import React from "react";
import Link from "next/link";
import Dropdown from "@/components/shared/Dropdown";
import Icon from "@/components/shared/Icon";

// Mock user data - replace with actual auth context later
const mockUser = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  account: { name: "Acme Corporation" },
};

const Header: React.FC = () => {
  const user = mockUser; // Use actual user data when available

  const userDropdownContent = (
    <div className="mt-2 rounded-sm bg-white py-2 text-sm shadow-xl w-48">
      {/* <Link href={`/users/${user.id}/edit`} className="block px-6 py-2 hover:bg-indigo-600 hover:text-white">
                My Profile
            </Link>
            <Link href="/users" className="block px-6 py-2 hover:bg-indigo-600 hover:text-white">
                Manage Users
            </Link> */}
      {/* Add actual links when user pages exist */}
      <button className="block w-full px-6 py-2 text-left hover:bg-indigo-600 hover:text-white">
        My Profile (Link)
      </button>
      <button className="block w-full px-6 py-2 text-left hover:bg-indigo-600 hover:text-white">
        Manage Users (Link)
      </button>
      <button
        // onClick={handleLogout} // Implement logout
        className="block w-full px-6 py-2 text-left hover:bg-indigo-600 hover:text-white"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="md:text-md flex w-full items-center justify-between border-b bg-white p-4 text-sm md:px-12 md:py-0">
      <div className="mr-4 mt-1">{user.account.name}</div>
      <Dropdown
        placement="bottom-end"
        ariaLabel="User menu"
        dropdownContent={userDropdownContent}
      >
        <div className="group flex cursor-pointer select-none items-center mt-1">
          <div className="mr-1 whitespace-nowrap text-gray-800 focus:text-indigo-600 group-hover:text-indigo-600">
            {user.first_name}
            <span className="hidden md:inline"> {user.last_name}</span>
          </div>
          <Icon
            name="cheveron-down"
            className="h-5 w-5 fill-gray-700 focus:fill-indigo-600 group-hover:fill-indigo-600"
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default Header;
