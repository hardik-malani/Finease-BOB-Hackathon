import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';
import Chatbot from './pages/Chatbot.jsx';
import FinancialLiteracy from './pages/FinancialLiteracy.jsx';
import DocumentDropbox from './pages/DocumentDropbox.jsx';
import InvestmentPortfolio from './pages/InvestmentPortfolio.jsx';
import BudgetTracking from './pages/BudgetTracking.jsx';
import GoalSetting from './pages/GoalSetting.jsx';
import Retirement from './pages/Retirement.jsx';
import Profile from './pages/ProfileSettings.jsx';
import LandingPage from './pages/LandingPage.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  return (
    <Router>
      <Link to="/chatbot">
      <div className='fixed right-10 bottom-10 size-12 md:size-16'><img src={"/chatbot.png"} alt="chatbot-logo" /></div>
      </Link>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/sign-in" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot/>} />
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/document-dropbox" element={<DocumentDropbox/>} />
        <Route path="/investment" element={<InvestmentPortfolio/>} />
        <Route path="/budget-tracking" element={<BudgetTracking/>} />
        <Route path="/goal-setting" element={<GoalSetting/>} />
        <Route path="/retirement" element={<Retirement/>} />
        <Route path="/profile-settings" element={<Profile/>} />
      </Routes>
    </Router>
  );
};

export default App;
