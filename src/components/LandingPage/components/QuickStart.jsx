import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  FaRobot, 
  FaComments, 
  FaBook, 
  FaChartBar,
  FaPlay,
  FaArrowRight
} from 'react-icons/fa';

const QuickStart = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const navigate = useNavigate();

  const tools = [
    {
      icon: <FaRobot className="text-3xl" />,
      title: 'AI Chat Assistant',
      description: 'Start a conversation with our AI tutor to get personalized help with any subject.',
      action: 'Start Chat',
      color: 'from-blue-500 to-cyan-500',
      href: '/chat'
    },
    {
      icon: <FaBook className="text-3xl" />,
      title: 'Learning Modules',
      description: 'Access structured learning content organized by topics and difficulty levels.',
      action: 'Browse Modules',
      color: 'from-purple-500 to-pink-500',
      href: '/modules'
    },
    {
      icon: <FaChartBar className="text-3xl" />,
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed analytics and performance insights.',
      action: 'View Analytics',
      color: 'from-green-500 to-emerald-500',
      href: '/analytics'
    },
    {
      icon: <FaComments className="text-3xl" />,
      title: 'Study Groups',
      description: 'Join AI-moderated study groups to learn collaboratively with peers.',
      action: 'Join Groups',
      color: 'from-orange-500 to-red-500',
      href: '/groups'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Subject',
      description: 'Select from a wide range of subjects and topics you want to learn or improve.'
    },
    {
      number: '02',
      title: 'Get AI Assessment',
      description: 'Our AI analyzes your current knowledge level and identifies learning gaps.'
    },
    {
      number: '03',
      title: 'Follow Custom Path',
      description: 'Receive a personalized learning path tailored to your goals and learning style.'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor your improvement with real-time analytics and adaptive recommendations.'
    }
  ];

  return (
    <section id="quick-start" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learning Tools & Quick Start
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with our powerful AI learning tools designed to accelerate your educational journey
          </p>
        </motion.div>

        {/* Learning Tools */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Powerful Learning Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {tool.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {tool.description}
                  </p>
                  <motion.button
                    className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300"
                    onClick={() => navigate(tool.href)}
                    whileHover={{ x: 5 }}
                  >
                    {tool.action}
                    <FaArrowRight className="ml-2 text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Begin Your Learning Journey?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Start with our AI chat assistant and experience personalized learning like never before
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="mr-2" />
              Start Learning Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickStart; 