
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import GoalList from '../components/goalSetting/GoalList';
import GoalProgress from '../components/goalSetting/GoalProgress';
import AddGoalForm from '../components/goalSetting/AddGoalForm';
import goalSettingData from '../data/goalSettingData.json';

const GoalSetting = () => {
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setData(goalSettingData);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { user, goals, successRate } = data;
  const storedUserName = localStorage.getItem('userName');
  const userName = storedUserName ? JSON.parse(storedUserName) : 'Default Name';


  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className=' lg:hidden'>
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Goal Setting</h1>
          <p className="text-gray-600">Track and manage your financial goals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GoalList goals={goals} />
          </div>
          <div>
            <GoalProgress successRate={successRate} />
            <AddGoalForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetting;