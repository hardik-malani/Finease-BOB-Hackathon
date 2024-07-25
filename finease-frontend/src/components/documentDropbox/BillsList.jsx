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
        setBills(response.data.slice(0, 5)); 
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
          const parts = bill.split(' ');
          const date = `${parts[0]} ${parts[1]}, ${parts[2]}`;
          const amountIndex = parts.findIndex(part => part.match(/^-?\d+\.\d{2}$/));
          const amount = amountIndex !== -1 ? parts[amountIndex] : 'N/A';
          const balance = parts[parts.length - 1];
          const transaction = parts.slice(3, amountIndex).join(' ');

          return (
            <div key={index} className="border rounded-lg p-4 mb-4 shadow-lg bg-white">
              <div className="text-lg font-medium mb-2">Date: {date}</div>
              <div className="text-sm mb-2">Transaction: {transaction}</div>
              <div className={`text-sm mb-2 ${amount.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                Amount: {amount}
              </div>
              <div className="text-sm mb-4">Balance: {balance}</div>
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
