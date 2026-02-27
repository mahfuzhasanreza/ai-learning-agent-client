import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../../../public/assets/logo.svg';
import { Context } from '../../../context/Context';
import { UserAuth } from '../../../context/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useContext(Context);
  const { user, isAuthenticated, signOut } = UserAuth();

  // Landing page section anchors only — authenticated app routes live in the sidebar
  const navItems = [
    { name: 'Features',    href: '#features',    id: 'features'    },
    { name: 'Quick Start', href: '#quick-start', id: 'quick-start' },
    { name: 'Stats',       href: '#stats',       id: 'stats'       },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

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
    if (location.pathname === '/') setActiveSection('');
  }, [location.pathname]);

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
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#13121D] border-b border-gray-800 shadow-sm'
            : 'bg-white border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img className="bg-transparent" src={logo} alt="COSMOS" />
            <span className={`ml-3 font-bold text-xl lg:text-3xl tracking-tight ${
              scrolled ? (isDark ? 'text-white' : 'text-gray-900') : 'text-white'
            }`}>
              COSMOS
            </span>
          </motion.div>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group cursor-pointer ${
                  isActive(item.id)
                    ? scrolled
                      ? isDark ? 'text-orange-400 bg-gray-800' : 'text-orange-500 bg-orange-50'
                      : 'text-white bg-white/20'
                    : scrolled
                      ? isDark ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-orange-500 transition-all duration-300 ${
                  isActive(item.id) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                }`} />
              </motion.button>
            ))}

            {/* Right-side controls */}
            <div className="ml-4 pl-4 border-l border-gray-300/30 flex items-center gap-3">
              {isAuthenticated() && user ? (
                <>
                  {/* Dashboard CTA */}
                  <motion.button
                    className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors duration-200 shadow-sm cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    Dashboard
                  </motion.button>

                  {/* User Avatar + Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold ring-2 ring-orange-200 overflow-hidden cursor-pointer"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user.profile_image ? (
                        <img src={user.profile_image} alt={user.email} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm">{getUserInitials()}</span>
                      )}
                    </motion.button>

                    {showUserDropdown && (
                      <motion.div
                        className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl overflow-hidden border ${
                          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-orange-100">
                              {user.profile_image ? (
                                <img src={user.profile_image} alt={user.email} className="w-full h-full object-cover" />
                              ) : (
                                <span>{getUserInitials()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {user.email?.split('@')[0].replace(/\d+$/, '') || 'User'}
                              </p>
                              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {user.student_id && (
                            <div className={`mt-2 pt-2 border-t text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                              Student ID: <span className="font-medium">{user.student_id}</span>
                            </div>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => { navigate('/profile'); setShowUserDropdown(false); }}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                              isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-[#f9fafb]'
                            }`}
                          >
                            <FaUser className="w-3.5 h-3.5" />
                            View Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                              isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <FaSignOutAlt className="w-3.5 h-3.5" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <motion.button
                  className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors duration-200 shadow-sm cursor-pointer"
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Start Learning
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Mobile / Tablet right controls ── */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated() && user && (
              <button
                className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-orange-200"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.email} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{getUserInitials()}</span>
                )}
              </button>
            )}
            <motion.button
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                scrolled
                  ? isDark ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </motion.button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <div className={`px-4 py-4 space-y-1 rounded-xl mt-2 mb-3 shadow-xl border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* User info strip */}
            {isAuthenticated() && user && (
              <div className={`mb-3 pb-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-orange-100">
                    {user.profile_image ? (
                      <img src={user.profile_image} alt={user.email} className="w-full h-full object-cover" />
                    ) : (
                      <span>{getUserInitials()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.email?.split('@')[0].replace(/\d+$/, '') || 'User'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive(item.id)
                    ? isDark ? 'text-orange-400 bg-gray-700' : 'text-orange-500 bg-orange-50'
                    : isDark ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-700 hover:text-orange-500 hover:bg-[#f9fafb]'
                }`}
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                {item.name}
              </motion.button>
            ))}

            <div className={`pt-2 space-y-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              {isAuthenticated() && user ? (
                <>
                  <motion.button
                    className="w-full px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Go to Dashboard
                  </motion.button>
                  <motion.button
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                      isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'
                    }`}
                    onClick={handleLogout}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.27 }}
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.button
                  className="w-full px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Start Learning
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
