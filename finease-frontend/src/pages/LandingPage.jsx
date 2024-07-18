import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-blue-600 text-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <img src="/full-logo.png" alt="Finease Logo" className="h-8" />
        <nav className="hidden md:flex space-x-6 items-center">
          {/* <a href="dashboard" className="hover:text-blue-200">DASHBOARD</a>
          <a href="profile" className="hover:text-blue-200">PROFILE</a> */}
          <a href="signup" className="hover:text-blue-200 font-semibold">SIGN UP</a>
          <a href="sign-in" className="hover:text-blue-200 font-semibold">SIGN IN</a>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
          Free Download
        </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-2xl font-light mb-2">Simple. Effective. Interactive</h2>
          <h1 className="text-5xl font-bold mb-6">Welcome to<br />Finease</h1>
          <p className="mb-8 max-w-md">
            Empowering people in the new Digital economy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Suspendisse varius enim in eros elementum tristique. Duis cursus.
          </p>
          <div className="space-x-4">
            <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
              Sign Up
            </Link>
            <Link to="/sign-in" className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-400 transition duration-300">
              Log In
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src="/landing.png" alt="Credit Cards" className="w-full max-w-md mx-auto" />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;