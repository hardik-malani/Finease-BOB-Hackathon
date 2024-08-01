import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'https://finease-backend.azurewebsites.net';

const UploadSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event) => {
    const files = Array.from(event.target.files).filter(
      (file) => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files) => {
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post(`${API_URL}/upload_pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });
      console.log('Files uploaded:', response.data.uploaded_files);
      setMessage('Files uploaded successfully!');
      setMessageType('success');
      
      // Store the extracted text in local storage
      const { text } = response.data;
      localStorage.setItem('extractedText', text);

    } catch (error) {
      console.error('Error uploading files:', error);
      if (error.response) {
        setMessage(`Error: ${error.response.data.error || 'Unknown server error'}`);
      } else if (error.request) {
        setMessage('Error: No response from server. Please try again.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="border-dashed border-2 border-gray-300 p-6 rounded-lg bg-gray-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <p className="text-gray-500">Drop PDF files here to upload</p>
        <button
          className={`py-2 px-4 rounded mt-4 ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600'
          } text-white`}
          onClick={openFileBrowser}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload PDF'}
        </button>
        {message && (
          <p className={`mt-2 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <input
          type="file"
          className="hidden"
          multiple
          accept="application/pdf"
          onChange={onFileChange}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};

export default UploadSection;
