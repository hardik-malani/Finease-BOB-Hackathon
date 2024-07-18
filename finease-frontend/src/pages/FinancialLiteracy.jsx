import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/layout/Sidebar';
import NewsCard from '../components/financialLiteracy/NewsCard';
import BlogList from '../components/financialLiteracy/BlogList';
import newsAndBlogsData from '../data/financialLiteracy.json';

const FinancialLiteracy = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(newsAndBlogsData.newsAndBlogs);
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-blue-300 text-blue-700 p-2 rounded-xl">News And Blogs</h1>
              <button 
                className="lg:hidden text-gray-500 hover:text-gray-600" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {data.map(item => (
                item.type === 'news' ? (
                  <NewsCard key={item.id} news={item} />
                ) : (
                  <BlogList key={item.id} blog={item} />
                )
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialLiteracy;