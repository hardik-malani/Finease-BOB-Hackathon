import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTachometerAlt, FaRobot, FaBook, FaChartPie, FaDropbox, FaChartLine, FaBullseye, FaRetweet, FaUserCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-0 z-40 lg:static lg:inset-auto lg:translate-x-0 transform overflow-y-auto md:overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-blue-600 text-white w-full p-6 lg:w-72 lg:translate-x-0 lg:overflow-y-auto lg:h-full`}>
      <div className="text-lg lg:text-xl font-semibold mb-6 flex justify-between items-center">
        <img src={"/full-logo.png"} alt="logo" className='h-[40px]' />
        <FaBars className="lg:hidden" onClick={toggleSidebar} />
      </div>
      <nav className="space-y-2 text-base">
        <Link to="/dashboard" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaTachometerAlt className="mr-2 lg:mr-3" /> Dashboard
        </Link>
        <Link to="/chatbot" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaRobot className="mr-2 lg:mr-3" /> Chatbot
        </Link>
        <Link to="/financial-literacy" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaBook className="mr-2 lg:mr-3" /> Financial Literacy
        </Link>
        <Link to="/budget-tracking" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaChartPie className="mr-2 lg:mr-3" /> Budget Tracking
        </Link>
        <Link to="/document-dropbox" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaDropbox className="mr-2 lg:mr-3" /> Document DropBox
        </Link>
        <Link to="/investment" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaChartLine className="mr-2 lg:mr-3" /> Investment Portfolio
        </Link>
        <Link to="/goal-setting" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaBullseye className="mr-2 lg:mr-3" /> Goal Setting
        </Link>
        <Link to="/retirement" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaRetweet className="mr-2 lg:mr-3" /> Retirement
        </Link>
        <Link to="/profile-settings" onClick={toggleSidebar} className="block flex items-center p-2 rounded-lg hover:bg-blue-700">
          <FaUserCog className="mr-2 lg:mr-3" /> Profile Settings
        </Link>
      </nav>
      <div className="mt-4 lg:mt-6">
        <button className="w-full text-left flex items-center p-2 rounded-lg hover:bg-blue-700" onClick={toggleSidebar}>
          <FaSignOutAlt className="mr-2 lg:mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
