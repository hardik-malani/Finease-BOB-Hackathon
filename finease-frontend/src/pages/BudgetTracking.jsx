import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import BudgetSummary from '../components/budgetTracking/BudgetSummary';
import BudgetCalendar from '../components/budgetTracking/BudgetCalendar';
import BudgetChart from '../components/budgetTracking/BudgetChart';
import QuickTransaction from '../components/budgetTracking/QuickTransaction';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import Card from '../components/budgetTracking/Card';
import data from '../data/budgetTrackingData.json';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetTracking = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
  useEffect(() => {
    setBudgetData(data);
    console.log("Loaded budget data:", data);
  }, []);

  if (!budgetData) return <div>Loading...</div>;

  const { financeSummary, bills, budgetBreakdown, transactionHistory, quickTransactionContacts, cardDetails } = budgetData;

  const storedUserName = localStorage.getItem('userName');
  const userName = storedUserName ? JSON.parse(storedUserName) : 'Default Name';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8"> 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BudgetSummary financeSummary={financeSummary} />
                <div className="mt-6">
                  <BudgetCalendar bills={bills} />
                </div>
              </div>
              <div>
                <Card cardDetails={cardDetails} />
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <BudgetChart budgetBreakdown={budgetBreakdown} />
                </div>
                <QuickTransaction contacts={quickTransactionContacts} />
              </div>
            </div>
            <div className="mt-6">
              <TransactionHistory transactionHistory={transactionHistory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetTracking;
