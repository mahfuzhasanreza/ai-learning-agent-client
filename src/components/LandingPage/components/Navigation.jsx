import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import logo from '../../../../public/assets/logo.svg';
import { Context } from '../../../context/Context';
import { UserAuth } from '../../../context/AuthContext';
import DarkModeToggle from '../../DarkModeToggle/DarkModeToggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {isDark, isSidebarOpen} = useContext(Context);
  const { user, isAuthenticated, signOut } = UserAuth();

  // console.log("USERRRRRRRRRRRRRRRRRRRRRRRR", user);
  // Check if we're on the chat page
  const isChatPage = location.pathname === '/cosmos-chatbot';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

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
  { name: 'Home', href: '/', id: 'home' },
  { name: 'Performance Tracking', href: '/performance-tracking', id: 'performance' },
  { name: 'Study Plan', href: '/study-plan', id: 'plan' },
  { name: 'Roadmap', href: '/roadmap', id: 'roadmap' },
  // Conditionally add Chatbot
  ...(!user?.email ? [{ name: 'Chatbot', href: '/cosmos-chatbot', id: 'cosmoschat' }] : [])
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    setShowUserDropdown(false);
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
    // backdrop-blur-md
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isChatPage ? `${isDark ? 'bg-[#13121D]' : 'bg-white/95'} shadow-lg border-b border-gray-200/20` : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`${isSidebarOpen && isChatPage ? 'ml-120' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* <div className="w-6 h-6 lg:w-9 lg:h-9 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg cursor-pointer">
              <FaRobot className="text-white text-sm lg:text-base" />
            </div> */}
              <img className='bg-transparent' src={logo} alt="COSMOS" />
            <span className={`ml-3 font-bold text-xl lg:text-3xl tracking-tight cursor-pointer ${scrolled || isChatPage ? `${isDark? 'text-white' : 'text-gray-900'}` : 'text-white'}`}>
              COSMOS
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group cursor-pointer ${
                  isActive(item.id)
                    ? (scrolled || isChatPage)
                      ? 'text-amber-600 border-b-amber-600' 
                      : 'text-white border-b-amber-600'
                    : (scrolled || isChatPage)
                      ? `${isDark? 'text-gray-100' : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100/80'}`
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-300 ${
                  isActive(item.id) 
                    ? 'w-3/4' 
                    : 'w-0 group-hover:w-3/4'
                } ${(scrolled || isChatPage) ? 'group-hover:bg-yellow-600' : 'group-hover:bg-white'}`} />
              </motion.button>
            ))}
          

{

!user?.email && (
<div className="ml-4 pl-4 border-l border-gray-300/30">
      
              <motion.button
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isActive('chat')
                    ? 'btn-bg-primary  text-white shadow-lg shadow-yellow-500/25'
                    : 'btn-bg-primary text-white hover:shadow-lg hover:shadow-yellow-500/25'
                }`}
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span>Start Learning</span>
              </motion.button>
         
            </div>

)

}


{
             !user?.email || (

              <div className="ml-4 pl-4 border-l border-gray-300/30">
        
              <motion.button
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isActive('chat')
                    ? 'btn-bg-primary  text-white shadow-lg shadow-yellow-500/25'
                    : 'btn-bg-primary text-white hover:shadow-lg hover:shadow-yellow-500/25'
                }`}
                onClick={() => navigate('/cosmos-chatbot')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span>Chatbot</span>
              </motion.button>
   
            </div>

             )
            }

         

              <div className='mx-2 mt-1'>

<DarkModeToggle></DarkModeToggle>
                </div>


            
            
            {/* User Profile Dropdown */}
            {isAuthenticated() && user && (
              <div className="relative ml-3" ref={dropdownRef}>
                <motion.button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* User Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg cursor-pointer">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt={user.full_name || user.email} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{getUserInitials()}</span>
                    )}
                  </div>
                  {/* <FaChevronDown 
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180' : ''
                    } ${scrolled || isChatPage ? (isDark ? 'text-white' : 'text-gray-700') : 'text-white'}`}
                  /> */}
                </motion.button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <motion.div
                    className={`absolute right-0 mt-2 w-64 rounded-lg shadow-xl overflow-hidden ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* User Info Section */}
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg">
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
                        <div className="flex-1 min-w-0 ml-2">
                          <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {user.email.split("@")[0].replace(/\d+$/, "") || 'User'}
                          </p>
                          <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Additional User Info */}
                      {user.student_id && (
                        <div className={`mt-2 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Student ID: <span className="font-medium">{user.student_id}</span>
                          </p>
                        </div>
                      )}
                      {user.university && (
                        <div className="mt-1">
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            University: <span className="font-medium">{user.university}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                          isDark 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FaUser className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                          isDark 
                            ? 'text-red-400 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {navItems.slice(0, 2).map((item, index) => (
              <motion.button
                key={item.name}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer ${
                  isActive(item.id)
                    ? (scrolled || isChatPage)
                      ? 'text-yellow-600 bg-yellow-50/80 border border-yellow-200/50' 
                      : 'text-white bg-white/20 border border-white/30'
                    : (scrolled || isChatPage)
                      ? 'text-gray-700 hover:text-yellow-600 hover:bg-gray-100/80' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
            <motion.button
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
                isActive('chat')
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg'
              }`}
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start
            </motion.button>
            
            {/* User Profile for Tablet */}
            {isAuthenticated() && user && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg cursor-pointer"
                   onClick={() => setShowUserDropdown(!showUserDropdown)}>
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.full_name || user.email} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{getUserInitials()}</span>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* User Profile for Mobile */}
            {isAuthenticated() && user && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg cursor-pointer"
                   onClick={() => setShowUserDropdown(!showUserDropdown)}>
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.full_name || user.email} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs">{getUserInitials()}</span>
                )}
              </div>
            )}
            
            <motion.button
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                (scrolled || isChatPage)
                  ? `${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100/80'}`
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            height: isOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className={`px-4 py-4 space-y-2 rounded-xl mt-2 shadow-xl border ${
            isDark 
              ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
              : 'bg-white/95 backdrop-blur-md border-gray-200/20'
          }`}>
            {/* User Profile Section in Mobile Menu */}
            {isAuthenticated() && user && (
              <div className={`mb-3 pb-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt={user.full_name || user.email} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{getUserInitials()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.full_name || 'User'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  isActive(item.id)
                    ? `${isDark ? 'text-amber-400 bg-gray-700' : 'text-amber-600 bg-yellow-50'}`
                    : `${isDark ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50'}`
                }`}
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
            <div className={`pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200/50'}`}>
              <motion.button
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  isActive('chat')
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                }`}
                onClick={() => navigate('/chat')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Start Learning
              </motion.button>
              
              {/* Logout Button for Mobile */}
              {isAuthenticated() && user && (
                <motion.button
                  className={`mt-2 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 ${
                    isDark 
                      ? 'text-red-400 bg-gray-700 hover:bg-red-900/30' 
                      : 'text-red-600 bg-red-50 hover:bg-red-100'
                  }`}
                  onClick={handleLogout}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 