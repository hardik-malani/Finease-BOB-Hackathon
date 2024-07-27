import { useState, useEffect } from "react";
import React from 'react';
import axios from 'axios';


const ProfileInfo = ({ user }) => {

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get('https://finease-bob-hackathon.onrender.com/api/user', config);
        setUserName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="mb-4">
        <strong className="text-gray-700">Full Name:</strong> {userName}
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Mobile:</strong> {user.mobile}
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Email:</strong> {email}
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Location:</strong> {user.location}
      </div>
      <div className="flex space-x-4">
        <a href={user.socialMedia.facebook} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={user.socialMedia.twitter} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={user.socialMedia.instagram} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
  );
};

export default ProfileInfo;
