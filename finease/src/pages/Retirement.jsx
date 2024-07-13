import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import RetirementInfoForm from '../components/retirement/RetirementInfoForm';
import data from '../data/retirementData.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Retirement = () => {
  const [retirementData, setRetirementData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setRetirementData(data);
  }, []);

  if (!retirementData) return <div>Loading...</div>;

  const { user, retirementTracking } = retirementData;

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
        <Header user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Retirement Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">How long will my savings last?</h2>
          <Line data={retirementChartData} />
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
