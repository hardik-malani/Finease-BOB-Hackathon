
import React, { useState } from 'react';

const RetirementInfoForm = ({ initialInfo, onSave }) => {
  const [info, setInfo] = useState(initialInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(info);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-2">Current Age</label>
        <input
          type="number"
          name="currentAge"
          value={info.currentAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Retirement Age</label>
        <input
          type="number"
          name="retirementAge"
          value={info.retirementAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Marital Status</label>
        <select
          name="maritalStatus"
          value={info.maritalStatus}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Married">Married</option>
          <option value="Single">Single</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Spouse Age</label>
        <input
          type="number"
          name="spouseAge"
          value={info.spouseAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Work Income</label>
        <input
          type="number"
          name="workIncome"
          value={info.workIncome}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Current Saving</label>
        <input
          type="number"
          name="currentSaving"
          value={info.currentSaving}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="md:col-span-2 mx-auto">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default RetirementInfoForm;