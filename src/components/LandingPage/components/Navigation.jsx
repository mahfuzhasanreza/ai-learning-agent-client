import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot, FaUser, FaSignOutAlt, FaChevronDown, FaHome, FaChartLine, FaCalendarAlt, FaRoute, FaComments } from 'react-icons/fa';
import logo from '../../../../public/assets/logo.svg';
import { Context } from '../../../context/Context';
import { UserAuth } from '../../../context/AuthContext';
import DarkModeToggle from '../../DarkModeToggle/DarkModeToggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {isDark} = useContext(Context);
  const { user, isAuthenticated, signOut } = UserAuth();

  // console.log("USERRRRRRRRRRRRRRRRRRRRRRRR", user);

  useEffect(() => {
    const handleScroll = () => {
      // Detect active section based on scroll position
      const sections = ['features', 'quick-start', 'stats'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === '/cosmos-chatbot') {
      setActiveSection('cosmoschat');
    } else if(location.pathname === '/') {
      setActiveSection('home');
    } else if(location.pathname === '/performance-tracking') {
      setActiveSection('performance');
    } else if(location.pathname === '/study-plan') {
      setActiveSection('plan');
    } else if(location.pathname === '/roadmap') {
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
  // Conditionally add Chatbot
  ...(!user?.email ? [{ name: 'Chatbot', href: '/cosmos-chatbot', id: 'cosmoschat', icon: FaComments }] : [])
];


  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  const isActive = (itemId) => {
    return activeSection === itemId;
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Get user initials for avatar fallback
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

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <motion.button
        className={`fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
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

      {/* Left Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 shadow-2xl ${
          isDark ? 'bg-[#13121D] border-r border-gray-800' : 'bg-white border-r border-gray-200'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200/20">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img className='w-10 h-10' src={logo} alt="COSMOS" />
              <span className={`font-bold text-2xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                COSMOS
              </span>
            </motion.div>
          </div>

          {/* User Profile Section */}
          {isAuthenticated() && user && (
            <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.full_name || user.email} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{getUserInitials()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.email.split("@")[0].replace(/\d+$/, "") || 'User'}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.id)
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-yellow-600'
                    }`}
                    onClick={() => {
                      scrollToSection(item.href);
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Chatbot Button for Authenticated Users */}
            {user?.email && (
              <div className="mt-4 pt-4 border-t border-gray-200/20">
                <motion.button
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg"
                  onClick={() => {
                    navigate('/cosmos-chatbot');
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaComments className="w-5 h-5" />
                  <span>Chatbot</span>
                </motion.button>
              </div>
            )}

            {/* Start Learning Button for Non-Authenticated Users */}
            {!user?.email && (
              <div className="mt-4 pt-4 border-t border-gray-200/20">
                <motion.button
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg"
                  onClick={() => {
                    navigate('/login');
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Learning</span>
                </motion.button>
              </div>
            )}
          </nav>

          {/* Bottom Section - Dark Mode & Logout */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Dark Mode
              </span>
              <DarkModeToggle />
            </div>

            {/* User Actions */}
            {isAuthenticated() && user && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                    isDark 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
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

export default Navigation; 