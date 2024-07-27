import React from 'react';
import { FaChevronRight, FaTimes } from 'react-icons/fa';

const RecentChats = ({ recentChats, isOpen, onClose }) => {
  return (
    <div
      className={`${
        isOpen ? 'fixed inset-0 z-50 sm:relative sm:inset-auto' : 'hidden'
      } sm:block w-full sm:w-80 bg-white border-l border-gray-200 overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recents Chats</h2>
          <button onClick={onClose} className="sm:hidden text-gray-500">
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          {recentChats.map((chat) => (
            <div key={chat.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{chat.title}</h3>
                <p className="text-xs text-gray-500">{chat.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                  {chat.category}
                </span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentChats;
