import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = { name, email, password };

    try {
      const response = await axios.post('https://finease-bob-hackathon.onrender.com/api/signup', userData);

      console.log('Sign up successful:', response.data);

      setIsLoading(false);
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign up failed:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-600 text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">Signing up...</p>
          <svg className="animate-spin h-8 w-8 mx-auto text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background icons */}
      <div className="absolute inset-0 z-0">
        <svg className="absolute top-10 left-10 text-blue-500 opacity-50 w-16 h-16 md:w-24 md:h-24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        <svg className="absolute bottom-10 right-10 text-blue-500 opacity-50 w-24 h-24 md:w-32 md:h-32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
        </svg>
        <svg className="absolute top-1/2 left-1/4 text-blue-500 opacity-50 w-12 h-12 md:w-16 md:h-16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </div>

      <header className="w-full max-w-4xl flex justify-center items-center mb-8 z-10 px-4 md:px-0 space-x-[10%] md:justify-between md:-mt-10">
        <Link to="/" className="text-white">
          <img src="/full-logo.png" alt="Finease" className="h-8 md:h-10" />
        </Link>
        <nav className="flex space-x-4 md:space-x-6 text-white">
          {/* <Link to="/dashboard" className="hover:text-blue-200 text-sm md:text-base">DASHBOARD</Link>
          <Link to="/profile" className="hover:text-blue-200 text-sm md:text-base">PROFILE</Link>
          <Link to="/sign-up" className="hover:text-blue-200 text-sm md:text-base">SIGN UP</Link> */}
          {/* <Link to="/sign-in" className="hover:text-blue-200 text-sm md:text-base">SIGN IN</Link> */}
        </nav>
        <button className="bg-white text-blue-600 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-100 transition duration-300">
          Free Download
        </button>
      </header>

      <main className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-md z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">Welcome!</h1>
        <p className="text-center text-gray-600 mb-6 md:mb-8">
          Create a new account for free.
        </p>

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email address"
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
            SIGN UP
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/sign-in" className="text-blue-600 font-semibold">Sign in</Link>
        </p>
      </main>
    </div>
  );
};

export default SignUp;
