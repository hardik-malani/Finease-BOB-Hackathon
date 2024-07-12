import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';
import Chatbot from './pages/Chatbot.jsx';
import FinancialLiteracy from './pages/FinancialLiteracy.jsx';
import DocumentDropbox from './pages/DocumentDropbox.jsx';
import InvestmentPortfolio from './pages/InvestmentPortfolio.jsx';

const App = () => {
  return (
    <Router>
      <Link to="/chatbot">
      <div className='fixed right-10 bottom-10 size-12 md:size-16'><img src={"/chatbot.png"} alt="chatbot-logo" /></div>
      </Link>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot/>} />
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/document-dropbox" element={<DocumentDropbox/>} />
        <Route path="/investment" element={<InvestmentPortfolio/>} />
      </Routes>
    </Router>
  );
};

export default App;
