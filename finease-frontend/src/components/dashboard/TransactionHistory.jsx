import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_transactions`);
        // Normalize keys to uppercase
        const normalizedTransactions = response.data.transactions.map(transaction => ({
          Date: transaction.Date,
          Transaction: transaction.Transaction,
          Amount: typeof transaction.Amount === 'string' 
            ? parseFloat(transaction.Amount.replace(/₹|,/g, '')) 
            : transaction.Amount,  // Ensure amount is a number
          Balance: typeof transaction.Balance === 'string' 
            ? parseFloat(transaction.Balance.replace(/₹|,/g, '')) 
            : transaction.Balance   // Ensure balance is a number
        }));
        setTransactions(normalizedTransactions);
      } catch (error) {
        setError('Error fetching transactions');
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  const getAmountColor = (amount) => {
    return amount < 0 ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Transaction</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{transaction.Date}</td>
                <td className="px-4 py-2">{transaction.Transaction}</td>
                <td className={`px-4 py-2 ${getAmountColor(transaction.Amount)}`}>
                  ₹ {transaction.Amount.toFixed(2)}  {/* Ensure amount is formatted as a number */}
                </td>
                <td className="px-4 py-2">₹ {transaction.Balance.toFixed(2)}</td> {/* Ensure balance is formatted as a number */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
