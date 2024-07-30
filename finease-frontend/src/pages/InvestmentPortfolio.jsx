import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StockChart from '../components/investmentPortfolio/StockChart';
import RecommendedStocks from '../components/investmentPortfolio/RecommendedStocks';
import TradeHistory from '../components/investmentPortfolio/TradeHistory';
import StockOptions from '../components/investmentPortfolio/StockOptions';
import data from '../data/investmentPortfolioData.json';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const InvestmentPortfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    setPortfolioData(data);
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

  if (!portfolioData) return <div>Loading...</div>;

  const { user, stockPerformance, recommendedStocks, tradeHistory, portfolioSummary } = portfolioData;
  
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-4"> */}
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {/* </div> */}

        {/* Portfolio Summary */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h1 className="text-2xl font-bold mb-4">Investment Portfolio</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Total Investment</p>
              <p className="text-xl font-semibold">₹{user.totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Return</p>
              <p className="text-xl font-semibold">₹{user.totalReturn.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Return Percentage</p>
              <p className="text-xl font-semibold">{user.returnPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <StockChart data={stockPerformance} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <StockOptions data={portfolioSummary} />
          </div>
        </div>

        {/* Recommended Stocks and Trade History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecommendedStocks stocks={recommendedStocks} />
          <TradeHistory trades={tradeHistory} />
        </div>
      </div>
    </div>
  );
};

export default InvestmentPortfolio;
