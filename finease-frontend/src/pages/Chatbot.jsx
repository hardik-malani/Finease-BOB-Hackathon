import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatInterface from '../components/chatbot/ChatInterface';
import RecentChats from '../components/chatbot/RecentChats';
import chatbotData from '../data/chatbotData.json';
import { FaBars, FaBell } from 'react-icons/fa';
import axios from 'axios';

const Chatbot = () => {
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  
  useEffect(() => {
    setData(chatbotData);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get('https://finease-bob-hackathon.onrender.com/api/user', config);
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const { user, messages, recentChats } = data;
  const storedUserName = localStorage.getItem('userName');
  const userName = storedUserName ? JSON.parse(storedUserName) : 'Default Name';

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 text-gray-500 lg:hidden"
              >
                <FaBars />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Hey {userName}!</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4 hidden sm:block">
                <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <button
                onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
                className="mr-4 text-gray-500 sm:hidden"
              >
                <FaBell />
              </button>
              <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user.avatar} alt={userName} />
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <ChatInterface messages={messages} user={userName} />
          <RecentChats recentChats={recentChats} isOpen={isRecentChatsOpen} onClose={() => setIsRecentChatsOpen(false)} />
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
