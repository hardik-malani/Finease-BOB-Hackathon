import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const DocumentsList = ({ documents }) => {
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
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
            <button className="text-blue-500">VIEW</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsList;