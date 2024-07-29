import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import RetirementInfoForm from '../components/retirement/RetirementInfoForm';
import data from '../data/retirementData.json';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Retirement = () => {
  const [retirementData, setRetirementData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    setRetirementData(data);
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
  
  if (!retirementData) return <div>Loading...</div>;

  const { user, retirementTracking } = retirementData;
  const storedUserName = localStorage.getItem('userName');
  const userName = storedUserName ? JSON.parse(storedUserName) : 'Default Name';


  const retirementChartData = {
    labels: retirementTracking.dates,
    datasets: [
      {
        label: 'Savings',
        data: retirementTracking.savings,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const handleSaveInfo = (updatedInfo) => {
    setRetirementData({
      ...retirementData,
      user: {
        ...user,
        ...updatedInfo,
      },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Retirement Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">What are my estimated savings in that year?</h2>
        </div>

        {/* Retirement Info Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Retirement Information</h2>
          <RetirementInfoForm initialInfo={user} onSave={handleSaveInfo} />
        </div>
      </div>
    </div>
  );
};

export default Retirement;
