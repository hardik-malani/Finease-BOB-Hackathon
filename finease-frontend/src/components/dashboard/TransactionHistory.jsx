import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';
const parseTransaction = (transaction) => {

  const parts = transaction.split(/\s+/);

  const date = `${parts[0]} ${parts[1]}, ${parts[2]}`;

  const amountIndex = parts.findIndex(part => part.match(/^-?\d+\.\d{2}$/));
  const amount = amountIndex !== -1 ? parts[amountIndex] : 'N/A';

  const balance = parts[parts.length - 1];

  const transactionDesc = parts.slice(3, amountIndex).join(' ');

  return {
    date,
    transactionDesc,
    amount,
    balance
  };
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_transactions`);
        const parsedTransactions = response.data.map(parseTransaction);
        setTransactions(parsedTransactions);
      } catch (error) {
        setError('Error fetching transactions');
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  const getAmountColor = (amount) => {
    return parseFloat(amount) < 0 ? 'text-red-500' : 'text-green-500';
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
                <td className="px-4 py-2">{transaction.date}</td>
                <td className="px-4 py-2">{transaction.transactionDesc}</td>
                <td className={`px-4 py-2 ${getAmountColor(transaction.amount)}`}>
                  ₹ {transaction.amount}
                </td>
                <td className="px-4 py-2">₹ {transaction.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
