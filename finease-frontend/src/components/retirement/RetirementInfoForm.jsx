import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'https://finease-backend.azurewebsites.net/retirement_planning';

const RetirementInfoForm = ({ initialInfo = {} }) => {
  const [info, setInfo] = useState({
    currentAge: '',
    retirementAge: '',
    maritalStatus: 'Married',
    spouseAge: '',
    workIncome: '',
    currentSaving: '',
    ...initialInfo
  });
  const [savingsData, setSavingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (['Single', 'Divorced', 'Widowed'].includes(info.maritalStatus)) {
      setInfo((prevInfo) => ({ ...prevInfo, spouseAge: '' }));
    }
  }, [info.maritalStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (parseInt(info.currentAge, 10) > parseInt(info.retirementAge, 10)) {
      alert('Current age cannot be greater than retirement age');
      setLoading(false);
      return;
    }

    const dataToSend = { ...info };
    if (['Single', 'Divorced', 'Widowed'].includes(info.maritalStatus)) {
      delete dataToSend.spouseAge;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch savings data');
      }

      const data = await response.json();
      setSavingsData(data.retirementTracking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
        {info.maritalStatus === 'Married' && (
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
        )}
        <div>
          <label className="block mb-2">Work Income (Monthly)</label>
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
            Calculate Retirement Savings
          </button>
        </div>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {savingsData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Retirement Savings Projection</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RetirementInfoForm;
