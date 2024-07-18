import React, { useState } from 'react';

const QuickTransaction = ({ contacts }) => {
  const [amount, setAmount] = useState('');

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Quick Transaction</h2>
      <div className="flex overflow-x-auto space-x-4 mb-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full" />
            <p className="text-sm mt-1">{contact.name}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="number"
          placeholder="Amount"
          className="flex-1 p-2 border rounded-l"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default QuickTransaction;