import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaHome, 
  FaUsers, 
  FaQuestionCircle, 
  FaUpload, 
  FaFileAlt, 
  FaCode, 
  FaPlus,
  FaRobot,
  FaComments,
  FaBook,
  FaChartLine
} from 'react-icons/fa';
import { MdDarkMode, MdLightMode, MdComputer } from 'react-icons/md';

const Sidebar = ({ user, onLinkClick, isDark, setTheme, theme }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (onLinkClick) onLinkClick();
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.profile?.full_name) {
      const names = user.profile.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = () => {
    // Add your sign out logic here
    navigate('/');
  };

  return (
    <>
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
        className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300  ${
          isDark ? 'bg-[#13121D] border-r border-gray-800' : 'bg-white border-r border-gray-200'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigation('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-lg font-bold text-white ">
                C
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-semibold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  COSMOS
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Admin Panel
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            {/* Overview */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Overview
              </div>
              <motion.button
                onClick={() => handleNavigation('/dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white '
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                }`}
                whileHover={{ x: 5 }}
              >
                <FaHome className="w-4 h-4" />
                <span>Dashboard</span>
              </motion.button>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* Training */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Training
              </div>
              <div className="space-y-1">
                <motion.button
                  onClick={() => handleNavigation('/dashboard/add-question')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/add-question')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white '
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Question</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/questions')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/questions')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaQuestionCircle className="w-4 h-4" />
                  <span>Questions</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/upload')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/upload')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaUpload className="w-4 h-4" />
                  <span>Upload Content</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/contents')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/contents')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaFileAlt className="w-4 h-4" />
                  <span>Contents</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/update-embeddings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/update-embeddings')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaCode className="w-4 h-4" />
                  <span>Update Embeddings</span>
                </motion.button>
              </div>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* Agent Management */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Agent Management
              </div>
              <div className="space-y-1">
                <motion.button
                  onClick={() => handleNavigation('/dashboard/create-agent')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/create-agent')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Create Agent</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/agents')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/agents')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaRobot className="w-4 h-4" />
                  <span>Agents</span>
                </motion.button>
              </div>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* Chat */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Chat
              </div>
              <motion.button
                onClick={() => handleNavigation('/chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/chat')
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                }`}
                whileHover={{ x: 5 }}
              >
                <FaComments className="w-4 h-4" />
                <span>Chat</span>
              </motion.button>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* Course Management */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Course Management
              </div>
              <motion.button
                onClick={() => handleNavigation('/dashboard/courses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard/courses')
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                }`}
                whileHover={{ x: 5 }}
              >
                <FaBook className="w-4 h-4" />
                <span>Courses</span>
              </motion.button>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* User Management */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                User Management
              </div>
              <motion.button
                onClick={() => handleNavigation('/dashboard/users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard/users')
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                }`}
                whileHover={{ x: 5 }}
              >
                <FaUsers className="w-4 h-4" />
                <span>Users</span>
              </motion.button>
            </div>

            <div className={`my-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

            {/* System */}
            <div className="mb-4">
              <div className={`text-xs font-medium uppercase tracking-wider px-2 mb-2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                System
              </div>
              <div className="space-y-1">
                <motion.button
                  onClick={() => handleNavigation('/dashboard/system-logs')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/system-logs')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaChartLine className="w-4 h-4" />
                  <span>System Logs</span>
                </motion.button>

                <motion.button
                  onClick={() => handleNavigation('/dashboard/help')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard/help')
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <FaQuestionCircle className="w-4 h-4" />
                  <span>Help</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} p-4`}>
            {/* Theme Toggle */}
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
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
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
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
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
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
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

            {/* User Profile */}
            <div className={`p-3 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
              <div className="flex items-center gap-3">
                {user?.profile?.avatar_url ? (
                  <img
                    src={user.profile.avatar_url}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium ring-2 ring-gray-300">
                    {getUserInitials()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.profile?.full_name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => handleNavigation('/profile')}
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
                  onClick={handleSignOut}
                  className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Spacer - pushes content when sidebar is open on desktop */}
      <div 
        className={`transition-all duration-300 ${
          isOpen ? 'lg:ml-[280px]' : 'lg:ml-0'
        }`}
      />
    </>
  );
};

export default Sidebar;