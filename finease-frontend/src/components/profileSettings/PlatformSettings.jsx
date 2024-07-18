import React from 'react';

const ProfileSettings = ({ settings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Platform Settings</h2>
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Account Notifications</h3>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.account.followEmail} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Email me when someone follows me</span>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.account.answerEmail} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Email me when someone answers on my post</span>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.account.mentionEmail} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Email me when someone mentions me</span>
          </div>
        </div>
        <hr className="mb-6" />
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Application Notifications</h3>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.application.newLaunches} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Receive notifications about new launches and projects</span>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.application.monthlyUpdates} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Receive monthly product updates</span>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" checked={settings.application.newsletter} readOnly className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded" />
            <span className="text-gray-800">Subscribe to our newsletter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
