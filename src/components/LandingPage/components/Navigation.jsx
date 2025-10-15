import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot } from 'react-icons/fa';
import logo from '../../../../public/assets/logo.svg';
import { Context } from '../../../context/Context';
import DarkModeToggle from '../../DarkModeToggle/DarkModeToggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {isDark} = useContext(Context);

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
    if (location.pathname === '/chat') {
      setActiveSection('chat');
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Learning Tools', href: '#quick-start', id: 'quick-start' },
    { name: 'Success Metrics', href: '#stats', id: 'stats' },
    { name: 'AI Chat', href: '/chat', id: 'chat' }
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

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? `${isDark ? 'bg-dark' : 'bg-white/95'}  backdrop-blur-md shadow-lg border-b border-gray-200/20` : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className={`ml-3 font-bold text-xl lg:text-3xl tracking-tight cursor-pointer ${scrolled ? `${isDark? 'text-white' : 'text-gray-900'}` : 'text-white'}`}>
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
                    ? scrolled 
                      ? 'text-amber-600 border-b-amber-600' 
                      : 'text-white border-b-amber-600'
                    : scrolled 
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
                } ${scrolled ? 'group-hover:bg-yellow-600' : 'group-hover:bg-white'}`} />
              </motion.button>
            ))}
            <div className="ml-4 pl-4 border-l border-gray-300/30">
              <motion.button
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isActive('chat')
                    ? 'bg-primary  text-white shadow-lg shadow-yellow-500/25'
                    : 'bg-primary text-white hover:shadow-lg hover:shadow-yellow-500/25'
                }`}
                onClick={() => navigate('/student-dashboard')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span>Start Learning</span>
              </motion.button>
            </div>
            <DarkModeToggle></DarkModeToggle>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {navItems.slice(0, 2).map((item, index) => (
              <motion.button
                key={item.name}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer ${
                  isActive(item.id)
                    ? scrolled 
                      ? 'text-yellow-600 bg-yellow-50/80 border border-yellow-200/50' 
                      : 'text-white bg-white/20 border border-white/30'
                    : scrolled 
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100/80' 
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
          <div className="px-4 py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-xl mt-2 shadow-xl border border-gray-200/20">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  isActive(item.id)
                    ? 'text-amber-600 bg-yellow-50'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
            <div className="pt-2 border-t border-gray-200/50">
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
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 