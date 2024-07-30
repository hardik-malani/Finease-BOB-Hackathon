
import React from 'react';

const TradeHistory = ({ trades }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2">{trade.stock}</td>
                <td className={`px-4 py-2 ₹{trade.action === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.action}
                </td>
                <td className="px-4 py-2">{trade.quantity}</td>
                <td className="px-4 py-2">₹{trade.price.toFixed(2)}</td>
                <td className="px-4 py-2">{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;