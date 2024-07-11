import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';
import Chatbot from './pages/Chatbot.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot/>} />
      </Routes>
    </Router>
  );
};

export default App;
