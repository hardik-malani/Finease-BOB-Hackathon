import React, { useRef } from 'react';

const UploadSection = ({ handleFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileUpload(event);
  };

  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className="border-dashed border-2 border-gray-300 p-6 rounded-lg bg-gray-50" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <div className="text-center">
        <p className="text-gray-500">Drop files here to upload</p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded mt-4" onClick={openFileBrowser}>Upload</button>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};

export default UploadSection;