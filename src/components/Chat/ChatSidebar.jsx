import React, { useState } from 'react';
import { PlusCircle, FileText, Volume2, X, MessageSquare, Settings, Trash2, Search, ChevronRight, History, Clock } from "lucide-react";

export default function ChatSidebar({ isOpen, setIsOpen, newChat, setTtsSettingsOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('today');

  // Mock chat history data
  const chatHistory = {
    today: [
      { id: 1, title: 'What is C Programming?', time: '2 hours ago' },
      { id: 2, title: 'Database Management Systems', time: '3 hours ago' },
      { id: 3, title: 'Python Functions Explained', time: '5 hours ago' },
    ],
    yesterday: [
      { id: 4, title: 'Machine Learning Basics', time: 'Yesterday' },
      { id: 5, title: 'Web Development Guide', time: 'Yesterday' },
    ],
    previous7days: [
      { id: 6, title: 'Data Structures Overview', time: '3 days ago' },
      { id: 7, title: 'Java Programming', time: '5 days ago' },
    ],
    previous30days: [
      { id: 8, title: 'Algorithm Analysis', time: '2 weeks ago' },
      { id: 9, title: 'Network Security', time: '3 weeks ago' },
    ]
  };

  const sections = [
    { key: 'today', label: 'Today', icon: Clock },
    { key: 'yesterday', label: 'Yesterday', icon: History },
    { key: 'previous7days', label: 'Previous 7 Days', icon: History },
    { key: 'previous30days', label: 'Previous 30 Days', icon: History },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border-r border-white/10 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF4B00] to-[#a200ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4B00]/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">COSMOS</h2>
              <p className="text-xs text-gray-400">Chat History</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => {
              newChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#FF4B00] to-[#a200ff] text-white font-semibold hover:shadow-lg hover:shadow-[#FF4B00]/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FF4B00]/50 focus:bg-white/10 transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat History - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-6">
            {sections.map((section) => {
              const chats = chatHistory[section.key];
              if (!chats || chats.length === 0) return null;

              return (
                <div key={section.key} className="space-y-2">
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <section.icon className="w-4 h-4 text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {section.label}
                    </h3>
                  </div>
                  
                  {chats
                    .filter(chat => 
                      searchQuery === '' || 
                      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-left border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#FF4B00]/20 to-[#a200ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-[#FF4B00]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 font-medium truncate group-hover:text-white transition-colors">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{chat.time}</p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete chat', chat.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 p-4 space-y-2 bg-gradient-to-t from-[#0a0a0a] to-transparent">
          <button
            onClick={() => {
              console.log('Navigate to history');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <FileText className="w-5 h-5" />
            View All History
          </button>

          <button
            onClick={() => {
              setTtsSettingsOpen(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Volume2 className="w-5 h-5" />
            Text-to-Speech
          </button>

          <button
            onClick={() => {
              console.log('Open settings');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 75, 0, 0.3);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 75, 0, 0.5);
          }
        `}</style>
      </div>

      {/* Floating Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 left-6 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] text-white p-3 rounded-xl shadow-lg shadow-[#FF4B00]/30 hover:shadow-2xl hover:shadow-[#FF4B00]/40 z-30 transition-all duration-300 transform hover:scale-110 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}
    </>
  );
}