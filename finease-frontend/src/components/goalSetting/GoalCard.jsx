
import React from 'react';

const GoalCard = ({ goal }) => {
  console.log(goal)
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Target: ₹{goal.targetAmount.toLocaleString()}</span>
        <span className="text-gray-600">Current: ₹{goal.currentAmount.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Save ₹{goal.weeklyTarget} per week to reach your goal
      </p>
    </div>
  );
};

export default GoalCard;