import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProfileInfo from '../components/profileSettings/ProfileInfo';
import ProfileSettings from '../components/profileSettings/PlatformSettings';
import data from '../data/profileData.json';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulating data fetch with useEffect
  React.useEffect(() => {
    // Replace with actual data fetching logic
    setProfileData(data);
  }, []);

  if (!profileData) return <div>Loading...</div>;

  const { user, settings } = profileData;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto ">
        {/* Header */}
        <div className='ml-2'>
        <Header user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
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
