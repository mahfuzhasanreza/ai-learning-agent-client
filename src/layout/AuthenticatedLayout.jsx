import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaChartLine, FaCalendarAlt, FaRoute, FaComments } from 'react-icons/fa';
import { MdDarkMode, MdLightMode, MdComputer } from 'react-icons/md';
import logo from '../../public/assets/logo.svg';
import { Context } from '../context/Context';
import { UserAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/DarkModeToggle/DarkModeToggle';

const AuthenticatedLayout = () => {
  const { user, isAuthenticated, signOut } = UserAuth();
  const { isDark, setTheme, theme } = useContext(Context);
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default for logged-in users
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the chat route
  const isChatRoute = location.pathname === '/cosmos-chatbot';

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === '/cosmos-chatbot') {
      setActiveSection('cosmoschat');
    } else if (location.pathname === '/') {
      setActiveSection('home');
    } else if (location.pathname === '/performance-tracking') {
      setActiveSection('performance');
    } else if (location.pathname === '/study-plan') {
      setActiveSection('plan');
    } else if (location.pathname === '/roadmap') {
      setActiveSection('roadmap');
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', href: '/', id: 'home', icon: FaHome },
    { name: 'Performance Tracking', href: '/performance-tracking', id: 'performance', icon: FaChartLine },
    { name: 'Study Plan', href: '/study-plan', id: 'plan', icon: FaCalendarAlt },
    { name: 'Roadmap', href: '/roadmap', id: 'roadmap', icon: FaRoute },
  ];

  const scrollToSection = (href) => {
    navigate(href);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const isActive = (itemId) => {
    return activeSection === itemId;
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.full_name) {
      const names = user.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Only show sidebar for authenticated users
  if (!isAuthenticated() || !user) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Toggle Button - Fixed position */}
      <motion.button
        className={`fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 lg:hidden ${
          isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative left-0 top-0 h-screen z-40 flex-shrink-0 shadow-2xl ${
          isDark ? 'bg-[#13121D] border-r border-gray-800' : 'bg-white border-r border-gray-200'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
          width: isChatRoute ? 80 : 280
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
        style={{ width: isChatRoute ? '80px' : '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <motion.div
              className={`flex items-center cursor-pointer ${isChatRoute ? 'justify-center' : 'gap-2'}`}
              onClick={() => {
                navigate('/');
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white shadow-md">
                <img className='w-full h-full object-cover rounded-lg' src={logo} alt="COSMOS" />
              </div>
              <AnimatePresence mode="wait">
                {!isChatRoute && (
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={`text-sm font-semibold leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      COSMOS
                    </span>
                    <span className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Learning Platform
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            {/* Navigation */}
            <div className="mb-4">
              {!isChatRoute && (
                <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Navigation
                </div>
              )}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`w-full flex items-center ${isChatRoute ? 'justify-center px-3' : 'gap-3 px-4'} mt-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.id)
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                          : isDark
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                      }`}
                      whileHover={{ x: isChatRoute ? 0 : 5 }}
                      title={isChatRoute ? item.name : ''}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <AnimatePresence mode="wait">
                        {!isChatRoute && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* Chat */}
            <div className="mb-4">
              {!isChatRoute && (
                <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Chat
                </div>
              )}
              <motion.button
                onClick={() => {
                  navigate('/cosmos-chatbot');
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center ${isChatRoute ? 'justify-center px-3' : 'gap-3 px-4'} py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('cosmoschat')
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-orange-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                }`}
                whileHover={{ x: isChatRoute ? 0 : 5 }}
                title={isChatRoute ? 'Chatbot' : ''}
              >
                <FaComments className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isChatRoute && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      Chatbot
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} p-4`}>
            {/* Theme Toggle */}
            {!isChatRoute && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Theme
                  </span>
                </div>
                <div className={`flex items-center rounded-lg border p-1 ${
                  isDark ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  <button
                    className={`flex-1 h-8 rounded-md flex items-center justify-center transition-colors ${
                      theme === 'light'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : isDark
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <MdLightMode className="w-4 h-4" />
                  </button>
                  <button
                    className={`flex-1 h-8 rounded-md flex items-center justify-center transition-colors ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : isDark
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <MdDarkMode className="w-4 h-4" />
                  </button>
                  <button
                    className={`flex-1 h-8 rounded-md flex items-center justify-center transition-colors ${
                      theme === 'system'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : isDark
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    <MdComputer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className={`p-3 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
              <div className={`flex items-center ${isChatRoute ? 'justify-center' : 'gap-3'}`}>
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-gray-300"
                    title={isChatRoute ? user?.email : ''}
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-300"
                    title={isChatRoute ? user?.email : ''}
                  >
                    {getUserInitials()}
                  </div>
                )}
                <AnimatePresence mode="wait">
                  {!isChatRoute && (
                    <motion.div 
                      className="flex-1 min-w-0"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className={`text-sm font-medium truncate whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.email?.split("@")[0].replace(/\d+$/, "") || 'User'}
                      </p>
                      <p className={`text-xs truncate whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user?.email}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {!isChatRoute && (
                  <motion.div 
                    className="mt-3 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        navigate('/profile');
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        isDark 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaUser className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        isDark 
                          ? 'text-red-400 hover:bg-red-900/30' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area - Takes remaining width */}
      <div className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
