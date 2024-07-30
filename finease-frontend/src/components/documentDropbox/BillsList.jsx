import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_transactions`);
        const transactionData = response.data.transactions || []; 
        setBills(transactionData.slice(0, 5)); 
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error fetching transactions. Please try again later.');
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h2 className="text-lg font-semibold mb-4">Your Bills</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {bills.length > 0 ? (
        bills.map((bill, index) => {
          // Destructure and provide default values
          const { Date: date = 'N/A', Transaction: transaction = 'N/A', Amount: amount = '0.00', Balance: balance = '0.00' } = bill;

          // Ensure amount is a string for comparison
          const amountStr = String(amount).trim();
          
          return (
            <div key={index} className="border rounded-lg p-4 mb-4 shadow-lg bg-white">
              <div className="text-lg font-medium mb-2">Date: {date}</div>
              <div className="text-sm mb-2">Transaction: {transaction}</div>
              <div className={`text-sm mb-2 ${amountStr.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                Amount: {amountStr || 'N/A'}
              </div>
              <div className="text-sm mb-4">Balance: {balance || 'N/A'}</div>
            </div>
          );
        })
      ) : (
        <p>No bills found.</p>
      )}
    </div>
  );
};

export default BillsList;
