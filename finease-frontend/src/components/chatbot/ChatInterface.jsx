import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPaperPlane, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import axios from 'axios';
import { marked } from 'marked';

const API_URL = 'https://finease-backend.azurewebsites.net';

const ChatInterface = () => {
  const initialMessages = [
    {
      id: 0,
      sender: 'assistant',
      content: 'Hello! How can I assist you today?',
      isSpeaking: false,
    },
  ];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [queryType, setQueryType] = useState('bob');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim().toLowerCase() === 'quit' || input.trim().toLowerCase() === 'exit') {
      setMessages([
        ...messages,
        { id: messages.length, sender: 'user', content: input },
        { id: messages.length + 1, sender: 'assistant', content: 'Session ended.' },
      ]);
      setInput('');
      return;
    }

    const userMessage = { id: messages.length, sender: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`${API_URL}/${queryType}_chatbot`, {
        query: input,
        messages,
        language: selectedLanguage,
      });
      const botResponse = response.data.response;
      const assistantMessage = {
        id: messages.length + 1,
        sender: 'assistant',
        content: botResponse,
        isSpeaking: false,
      };

      setMessages([...messages, userMessage, assistantMessage]);

      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(botResponse);
      setCurrentUtterance(utterance);

      if (selectedLanguage !== 'en-US') {
        switch (selectedLanguage) {
          case 'guj_Gujr':
            utterance.lang = 'gu-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'gu-IN');
            break;
          case 'hin_Deva':
            utterance.lang = 'hi-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'hi-IN');
            break;
          case 'kan_Knda':
            utterance.lang = 'kn-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'kn-IN');
            break;
          case 'gom_Deva':
            utterance.lang = 'kok-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'kok-IN');
            break;
          case 'mar_Deva':
            utterance.lang = 'mr-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'mr-IN');
            break;
          case 'pan_Guru':
            utterance.lang = 'pa-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'pa-IN');
            break;
          case 'tam_Taml':
            utterance.lang = 'ta-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'ta-IN');
            break;
          case 'tel_Telu':
            utterance.lang = 'te-IN';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'te-IN');
            break;
          default:
            utterance.lang = 'en-US';
            utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'en-US');
            break;
        }
      } else {
        utterance.lang = 'en-US';
        utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === 'en-US');
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 1,
        sender: 'assistant',
        content: 'Sorry, something went wrong.',
      };
      setMessages([...messages, userMessage, errorMessage]);
    }

    setInput('');
  };

  const handleSpeechToText = async () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      let langCode = 'en-US';

      switch (selectedLanguage) {
        case 'guj_Gujr':
          langCode = 'gu-IN';
          break;
        case 'hin_Deva':
          langCode = 'hi-IN';
          break;
        case 'kan_Knda':
          langCode = 'kn-IN';
          break;
        case 'gom_Deva':
          langCode = 'kok-IN';
          break;
        case 'mar_Deva':
          langCode = 'mr-IN';
          break;
        case 'pan_Guru':
          langCode = 'pa-IN';
          break;
        case 'tam_Taml':
          langCode = 'ta-IN';
          break;
        case 'tel_Telu':
          langCode = 'te-IN';
          break;
        default:
          langCode = 'en-US';
          break;
      }

      recognition.lang = langCode;

      recognition.onresult = (event) => {
        const speechToTextResult = event.results[0][0].transcript;
        setInput(speechToTextResult);
      };

      recognition.start();
    } catch (error) {
      console.error('Error converting speech to text:', error);
    }
  };

  const handleStopSpeech = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePlayResponse = (response) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(response);
    setCurrentUtterance(utterance);
    utterance.lang = selectedLanguage !== 'en-US' ? selectedLanguage : 'en-US';
    utterance.voice = speechSynthesis.getVoices().find((voice) => voice.lang === utterance.lang);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const renderMessageContent = (content) => {
    const htmlContent = marked(content, { breaks: true });
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {renderMessageContent(message.content)}
                {message.sender === 'assistant' && (
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onClick={() => handlePlayResponse(message.content)}
                  >
                    {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-2 flex items-center space-x-2">
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
          className="mr-2 border p-1 rounded"
        >
          <option value="bob">Bank of Baroda Queries</option>
          <option value="transaction">Transaction Queries</option>
        </select>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mr-2 border p-1 rounded"
        >
          <option value="en-US">English</option>
          <option value="guj_Gujr">Gujarati</option>
          <option value="hin_Deva">Hindi</option>
          <option value="kan_Knda">Kannada</option>
          <option value="gom_Deva">Konkani</option>
          <option value="mar_Deva">Marathi</option>
          <option value="pan_Guru">Punjabi</option>
          <option value="tam_Taml">Tamil</option>
          <option value="tel_Telu">Telugu</option>
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          type="button"
          onClick={handleSpeechToText}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <FaMicrophone />
        </button>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
        >
          <FaPaperPlane />
        </button>
        <button
          type="button"
          onClick={handleStopSpeech}
          className="p-2 bg-red-500 text-white rounded"
        >
          {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
