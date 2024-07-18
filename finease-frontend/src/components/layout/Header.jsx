import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ userName, toggleSidebar }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold">Hey {userName}!</h1>
      <button className="text-gray-600 focus:outline-none lg:hidden" onClick={toggleSidebar}>
        <FaBars className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Header;
