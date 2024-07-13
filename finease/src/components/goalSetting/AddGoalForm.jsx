
import React, { useState } from 'react';

const AddGoalForm = () => {
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    console.log('New goal:', { goalTitle, targetAmount });
    setGoalTitle('');
    setTargetAmount('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700">
            Goal Title
          </label>
          <input
            type="text"
            id="goalTitle"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
            Target Amount (₹)
          </label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
};

export default AddGoalForm;