import React from 'react';

const BillsList = ({ bills }) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h2 className="text-lg font-semibold mb-4">Your Bills</h2>
      {bills.map((bill, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-lg bg-white">
          <div className="text-lg font-medium mb-2">{bill.billType}</div>
          <div className="text-sm mb-2">Company Name: {bill.companyName}</div>
          <div className="text-sm mb-2">Email Address: {bill.email}</div>
          <div className="text-sm mb-2">VAT Number: {bill.vatNumber}</div>
          <div className="text-sm mb-4">Amount: {bill.amount}</div>
          <div className="text-right">
            <button className="text-red-500 mr-2">DELETE</button>
            <button className="text-blue-500">EDIT</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillsList;