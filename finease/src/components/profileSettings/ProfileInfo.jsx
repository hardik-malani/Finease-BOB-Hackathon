import React from 'react';

const ProfileInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <p className="text-gray-700 mb-4">{user.bio}</p>
      <div className="mb-4">
        <strong className="text-gray-700">Full Name:</strong> {user.name}
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Mobile:</strong> {user.mobile}
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Email:</strong> {user.email}
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
