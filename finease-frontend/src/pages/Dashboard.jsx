import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import axios from 'axios';
import data from '../data/dashboardData.json';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FinanceSummary from '../components/dashboard/FinanceSummary';
import FinanceChart from '../components/dashboard/FinanceChart';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import RetirementTracking from '../components/dashboard/RetirementTracking';
import SustainabilityScore from '../components/dashboard/SustainabilityScore';
import GoalsSetting from '../components/dashboard/GoalsSetting';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    setDashboardData(data);
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
        localStorage.setItem('userName', JSON.stringify(response.data.name));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  const { user, finances, transactionHistory, goals, retirementTracking, sustainabilityScore } = dashboardData;

  const financeChartData = {
    labels: finances.dates,
    datasets: [
      {
        label: 'Income',
        data: finances.income,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Expenses',
        data: finances.expenses,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

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

  const sustainabilityScoreData = {
    labels: ['Carbon Footprint', 'Energy Consumption', 'Eco-Friendly Lifestyle'],
    datasets: [
      {
        label: 'Sustainability Score',
        data: [
          sustainabilityScore.details.carbonFootprint,
          sustainabilityScore.details.energyConsumption,
          sustainabilityScore.details.ecoFriendlyLifestyle,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Finance Summary */}
        <FinanceSummary user={user} />

        {/* Finance Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FinanceChart data={financeChartData} title="Finances" />
          <RetirementTracking data={retirementChartData} />
          <SustainabilityScore data={sustainabilityScoreData} />
        </div>

        {/* Transaction History */}
        <TransactionHistory transactionHistory={transactionHistory} />

        {/* Goals Setting */}
        <GoalsSetting goals={goals} />
      </div>
    </div>
  );
};

export default Dashboard;
