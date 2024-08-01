import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://finease-backend.azurewebsites.net';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();  // Hook for navigation

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_uploaded_files`);
      setDocuments(response.data.map(filename => ({
        name: filename,
        type: filename.endsWith('.pdf') ? 'PDF' : 'Unknown'
      })));
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const viewPDF = (filename) => {
    // Construct the URL to the PDF file
    const fileUrl = `${API_URL}/tmp/uploads/${filename}`;
    // Navigate to the URL
    window.open(fileUrl, '_blank');
  };

  const handleClearData = async () => {
    try {
      await axios.post(`${API_URL}/clear_data`);
      setDocuments([]);
      localStorage.removeItem('extractedText');  // Clear local storage
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
      <button 
        className="mb-4 text-red-500"
        onClick={handleClearData}
      >
        Clear All Data
      </button>
      {documents.map((document, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-lg bg-white">
          <div className="flex items-center mb-4">
            {document.type === 'PDF' && (
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 w-6 h-6 mr-4" />
            )}
            <div>
              <div className="text-sm font-medium">{document.name}</div>
              <div className="text-sm text-gray-500">{document.type}</div>
            </div>
          </div>
          <div className="text-right">
            <button 
              className="text-blue-500" 
              onClick={() => viewPDF(document.name)}
            >
              VIEW
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsList;
