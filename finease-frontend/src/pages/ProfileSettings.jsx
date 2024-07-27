import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProfileInfo from '../components/profileSettings/ProfileInfo';
import ProfileSettings from '../components/profileSettings/PlatformSettings';
import data from '../data/profileData.json';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Simulating data fetch with useEffect
  React.useEffect(() => {
    // Replace with actual data fetching logic
    setProfileData(data);
  }, []);

  React.useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!profileData) return <div>Loading...</div>;

  const { user, settings } = profileData;
  const storedUserName = localStorage.getItem('userName');
  const userName = storedUserName ? JSON.parse(storedUserName) : 'Default Name';


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto ">
        {/* Header */}
        <div className='ml-2'>
        <Header userName={userName} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            {/* Profile Information */}
            <ProfileInfo user={user} />

            {/* Profile Settings */}
            <ProfileSettings settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
