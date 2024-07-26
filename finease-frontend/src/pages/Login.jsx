import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      console.log(userData);
      const response = await axios.post('https://finease-bob-hackathon.onrender.com/api/login', userData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', JSON.stringify(email));

      console.log('Login successful:', response.data);

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials and try again.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background icons */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute top-10 left-10 text-blue-500 opacity-50 w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        <svg className="absolute bottom-10 right-10 text-blue-500 opacity-50 w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
        </svg>
        <svg className="absolute top-1/2 left-1/4 text-blue-500 opacity-50 w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </div>

      <header className="w-full max-w-4xl flex justify-center items-center mb-8 z-10 px-4 md:px-0 space-x-[10%] md:justify-between md:-mt-12">
        <Link to="/" className="text-white">
          <img src="/full-logo.png" alt="Finease" className="h-10" />
        </Link>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-100 transition duration-300">
          Free Download
        </button>
      </header>

      <main className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10 sm:mt-16">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome!</h1>
        <p className="text-center text-gray-600 mb-8">
          Login to your account!
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            LOGIN
          </button>
        </form>

        {/* Conditionally render the error message */}
        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
