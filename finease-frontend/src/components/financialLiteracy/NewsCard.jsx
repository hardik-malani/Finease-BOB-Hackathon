
import React from 'react';
import { FaComment, FaCalendarAlt } from 'react-icons/fa';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden  flex flex-col h-full justify-between">
      <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
        <p className="text-gray-600 mb-4">{news.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            {news.date}
          </div>
          {news.comments && (
            <div className="flex items-center">
              <FaComment className="mr-2" />
              {news.comments} comments
            </div>
          )}
        </div>
        {news.author && (
          <div className="mt-4 flex items-center">
            <img src={news.author.avatar} alt={news.author.name} className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm text-gray-700">{news.author.name}</span>
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-blue-500 text-white text-center cursor-pointer hover:bg-blue-600">
        Read More
      </div>
    </div>
  );
};

export default NewsCard;