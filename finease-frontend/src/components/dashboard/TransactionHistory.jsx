import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
        const response = await axios.get(`${API_URL}/transactions`);
        console.log(response.data); 

        const normalizedTransactions = response.data.map(transaction => ({
          Date: new Date(transaction.date).toLocaleDateString(), 
          Transaction: transaction.transaction,
          Amount: typeof transaction.amount === 'string' 
            ? parseFloat(transaction.amount.replace(/₹|,/g, '')) 
            : transaction.amount, 
          Balance: typeof transaction.balance === 'string' 
            ? parseFloat(transaction.balance.replace(/₹|,/g, '')) 
            : transaction.balance  
        }));
        setTransactions(normalizedTransactions);
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
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
                  ₹ {transaction.Amount.toFixed(2)}
                </td>
                <td className="px-4 py-2">₹ {transaction.Balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
