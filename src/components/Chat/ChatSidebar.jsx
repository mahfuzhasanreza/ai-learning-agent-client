import React, { useState, useEffect, useCallback, useContext } from 'react';
import { PlusCircle, FileText, Volume2, X, MessageSquare, Settings, Trash2, Search, ChevronRight, History, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../../services/apiService';
import { Context } from '../../context/Context';

export default function ChatSidebar({ isOpen, setIsOpen }) {
  const { loadChatHistory, threadId, newChat, chatHistoryRefresh } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    today: true,
    yesterday: false,
    previous7days: false,
    previous30days: false
  });
  const [chatHistory, setChatHistory] = useState({
    today: [],
    yesterday: [],
    previous7days: [],
    previous30days: []
  });
  const [loading, setLoading] = useState(false);
  const {setTtsSettingsOpen} = useContext(Context);

  // Handle chat click to load history
  const handleChatClick = async (clickedThreadId) => {
    try {
      await loadChatHistory(clickedThreadId);
      // Don't close sidebar - keep it open to show active state
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = useCallback((date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 14) {
      return '1 week ago';
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  }, []);

  // Helper function to organize chats by time period
  const organizeChatsByTime = useCallback((chats) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const organized = {
      today: [],
      yesterday: [],
      previous7days: [],
      previous30days: []
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.created_at);
      const formattedChat = {
        id: chat.thread_id,
        title: chat.title,
        time: formatTimeAgo(chatDate)
      };

      if (chatDate >= today) {
        organized.today.push(formattedChat);
      } else if (chatDate >= yesterday) {
        organized.yesterday.push(formattedChat);
      } else if (chatDate >= sevenDaysAgo) {
        organized.previous7days.push(formattedChat);
      } else if (chatDate >= thirtyDaysAgo) {
        organized.previous30days.push(formattedChat);
      }
    });

    return organized;
  }, [formatTimeAgo]);

  // Fetch chat history when sidebar opens
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getChatHistory();
        
        // Organize chats by time period
        const organized = organizeChatsByTime(data.chats || []);
        setChatHistory(organized);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        // Keep empty state on error
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen, organizeChatsByTime, chatHistoryRefresh]); // Re-fetch when chatHistoryRefresh changes

  const sections = [
    { key: 'today', label: 'Today', icon: Clock },
    { key: 'yesterday', label: 'Yesterday', icon: History },
    { key: 'previous7days', label: 'Previous 7 Days', icon: History },
    { key: 'previous30days', label: 'Previous 30 Days', icon: History },
  ];

  return (
    <>
      {/* Sidebar - Flex child, always visible on chat route with smooth animation */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="h-screen w-80 fixed top-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border-r border-white/10 shadow-2xl flex-shrink-0 flex flex-col"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
          >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-[#FF4B00]/10 to-[#a200ff]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF4B00] to-[#a200ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF4B00]/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Chat Menu</h2>
              {/* <p className="text-xs text-gray-400">Chat History</p> */}
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
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <button
            onClick={() => {
              newChat();
            }}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#FF4B00] to-[#a200ff] text-white font-semibold hover:shadow-lg hover:shadow-[#FF4B00]/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
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
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B00]"></div>
              </div>
            ) : (
              sections.map((section) => {
                const chats = chatHistory[section.key];
                if (!chats || chats.length === 0) return null;

                const isExpanded = expandedSections[section.key];
                const filteredChats = chats.filter(chat => 
                  searchQuery === '' || 
                  chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <div key={section.key} className="space-y-2">
                    {/* Section Header - Clickable to toggle */}
                    <button
                      onClick={() => setExpandedSections(prev => ({
                        ...prev,
                        [section.key]: !prev[section.key]
                      }))}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-2">
                        <section.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300">
                          {section.label}
                        </h3>
                        <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                          {filteredChats.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                      )}
                    </button>
                    
                    {/* Collapsible Chat List */}
                    {isExpanded && (
                      <motion.div 
                        className="space-y-1 mt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {filteredChats.map((chat, index) => {
                          const isActive = chat.id === threadId;
                          
                          return (
                            <motion.button
                              key={chat.id}
                              onClick={() => handleChatClick(chat.id)}
                              className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left border ${
                                isActive 
                                  ? 'bg-gradient-to-r from-[#FF4B00]/20 to-[#a200ff]/20 border-[#FF4B00]/50' 
                                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: index * 0.05,
                                duration: 0.3
                              }}
                              whileHover={{ x: 5 }}
                            >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-8 h-8 bg-gradient-to-br from-[#FF4B00]/20 to-[#a200ff]/20 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isActive ? 'ring-2 ring-[#FF4B00]/50' : ''
                              }`}>
                                <MessageSquare className={`w-4 h-4 ${isActive ? 'text-[#FF4B00]' : 'text-[#FF4B00]'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate transition-colors ${
                                  isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                }`}>
                                  {chat.title}
                                </p>
                                <p className={`text-xs mt-0.5 ${
                                  isActive ? 'text-gray-400' : 'text-gray-500'
                                }`}>{chat.time}</p>
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
                          </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 p-4 space-y-2 bg-gradient-to-t from-[#0a0a0a] to-transparent flex-shrink-0">
        

          <button
            onClick={() => {
              // setTtsSettingsOpen(true);
              setTtsSettingsOpen(true);
              // setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Volume2 className="w-5 h-5" />
            Text-to-Speech Setting
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed top-50 left-6 bg-gradient-to-r from-[#FF4B00] to-[#a200ff] text-white p-3 rounded-xl shadow-lg shadow-[#FF4B00]/30 hover:shadow-2xl hover:shadow-[#FF4B00]/40 z-30 transition-all duration-300 transform hover:scale-110 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </motion.button>
      )}
    </>
  );
}