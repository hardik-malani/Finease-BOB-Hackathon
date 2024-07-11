
import React from 'react';

const GoalsSetting = ({ goals }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">My Goals</h2>
      {goals.map((goal, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{goal.name}</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsSetting;
