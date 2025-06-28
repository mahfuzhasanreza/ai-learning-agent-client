import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaRobot, 
  FaBrain, 
  FaChartLine, 
  FaGraduationCap, 
  FaUsers, 
  FaLightbulb,
  FaShieldAlt,
  FaSync
} from 'react-icons/fa';

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: 'Topic-Wise AI Agents',
      description: 'Specialized AI agents for each subject area, providing expert guidance and personalized tutoring tailored to specific topics.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: 'Weakness Prediction',
      description: 'Advanced machine learning algorithms analyze your learning patterns to predict and identify potential knowledge gaps before they become problems.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Customized Learning Paths',
      description: 'AI-generated personalized learning journeys that adapt to your learning style, pace, and goals for optimal knowledge retention.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      title: 'Adaptive Learning',
      description: 'Real-time learning adjustments based on your performance, ensuring you stay challenged but never overwhelmed.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'Collaborative Learning',
      description: 'Connect with peers, share insights, and learn together in AI-moderated study groups and discussion forums.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <FaLightbulb className="text-4xl" />,
      title: 'Smart Recommendations',
      description: 'Intelligent content recommendations based on your learning history, interests, and current knowledge level.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Progress Tracking',
      description: 'Comprehensive analytics and progress monitoring with detailed insights into your learning journey and achievements.',
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: <FaSync className="text-4xl" />,
      title: 'Continuous Improvement',
      description: 'The system learns from your interactions to continuously improve recommendations and learning strategies.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionary Learning Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of education with our AI-powered learning platform that adapts to your unique needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of learners who have already discovered the power of AI-driven education
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 