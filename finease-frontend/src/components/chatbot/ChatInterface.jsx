import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';

const ChatInterface = ({ messages, user }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send message
    console.log('Sending message:', input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="bg-white px-4 py-2 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your message"
          className="flex-1 border-0 focus:ring-0 focus:outline-none"
        />
        <button type="button" className="p-2 rounded-full text-gray-400 hover:text-gray-600">
          <FaMicrophone />
        </button>
        <button type="submit" className="p-2 rounded-full text-blue-500 hover:text-blue-600">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;