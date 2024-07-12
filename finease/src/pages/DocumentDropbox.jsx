import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/layout/Sidebar';
import BillsList from '../components/documentDropbox/BillsList';
import DocumentsList from '../components/documentDropbox/DocumentsList';
import UploadSection from '../components/documentDropbox/UploadSection';
import dropboxData from '../data/dropboxData.json';

const DocumentDropbox = () => {
  const [files, setFiles] = useState([]);
  const [bills, setBills] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFiles(dropboxData.files);
    setBills(dropboxData.bills);
    setDocuments(dropboxData.documents);
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newDocuments = uploadedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Hamburger Menu */}
          <button className="md:hidden text-gray-600 mr-4 self-end text-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>

          {/* Title */}
          <h1 className="text-sm md:text-3xl font-semibold mb-4 md:mb-0">All Files</h1>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <label className="relative text-gray-400 focus-within:text-gray-600 block mb-4 md:mb-0">
              <input
                type="search"
                placeholder="Search documents..."
                className="border-b-2 border-gray-300 py-2 px-4 text-gray-600 outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            
            {/* Upload Button */}
            <label className="bg-blue-600 text-white py-2 px-4 rounded flex items-center cursor-pointer mb-4 md:mb-0">
              Upload or Drop
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
            </label>
            
            {/* Create Folder Button */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded flex items-center mb-4 md:mb-0">Create folder</button>
            
            {/* Edit PDF Button */}
            <button className="bg-blue-600 text-white py-2 px-4 rounded flex items-center mb-4 md:mb-0">Edit PDF</button>
          </div>
        </div>
        
        {/* Upload Section */}
        <UploadSection handleFileUpload={handleFileUpload} />
        
        {/* Lists Section */}
        <div className="flex flex-wrap mt-8 justify-around">
          <BillsList bills={bills} />
          <DocumentsList documents={documents} />
        </div>
      </div>
    </div>
  );
};

export default DocumentDropbox;
