import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const BlogList = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaCalendarAlt className="mr-2" />
          {blog.date}
        </div>
      </div>
      <div className="px-4 py-2 bg-blue-500 text-white text-center cursor-pointer hover:bg-blue-600 mt-auto">
        Read More
      </div>
    </div>
  );
};

export default BlogList;