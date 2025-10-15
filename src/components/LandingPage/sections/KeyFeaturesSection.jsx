import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaRobot,
  FaBrain,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaMobile,
  FaLightbulb,
  FaGraduationCap,
  FaCode,
  FaBookOpen,
  FaClock,
  FaTrophy
} from 'react-icons/fa';
import Title from '../../shared/Title';
import { Context } from '../../../context/Context';

const KeyFeaturesSection = () => {

  const {isDark} = useContext(Context);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <FaRobot className="text-4xl" />,
      title: "AI-Powered Learning",
      description: "Advanced artificial intelligence that adapts to your learning style and provides personalized guidance for optimal knowledge retention.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: "Intelligent Analytics",
      description: "Comprehensive learning analytics that track your progress, identify weak areas, and suggest targeted improvement strategies.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Progress Tracking",
      description: "Real-time monitoring of your learning journey with detailed insights into your performance and achievement milestones.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Collaborative Learning",
      description: "Connect with peers, join study groups, and participate in AI-moderated discussions for enhanced learning experiences.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your learning data and progress are protected with the highest privacy standards.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: "Cross-Platform Access",
      description: "Seamless learning experience across all devices - desktop, tablet, and mobile with synchronized progress.",
      color: "from-teal-500 to-blue-500",
      bgColor: "from-teal-50 to-blue-50"
    },
    {
      icon: <FaLightbulb className="text-4xl" />,
      title: "Smart Recommendations",
      description: "AI-driven suggestions for study materials, practice problems, and learning resources based on your performance.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      icon: <FaGraduationCap className="text-4xl" />,
      title: "Expert-Led Content",
      description: "Curated learning materials and expert-verified content ensuring high-quality educational resources.",
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50"
    },
    {
      icon: <FaCode className="text-4xl" />,
      title: "Interactive Coding",
      description: "Hands-on coding practice with real-time feedback, syntax highlighting, and instant error detection.",
      color: "from-gray-600 to-gray-800",
      bgColor: "from-gray-50 to-gray-100"
    },
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Comprehensive Resources",
      description: "Extensive library of tutorials, documentation, and reference materials covering all programming concepts.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "Flexible Learning",
      description: "Learn at your own pace with 24/7 access to all resources and adaptive scheduling based on your availability.",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50"
    },
    {
      icon: <FaTrophy className="text-4xl" />,
      title: "Achievement System",
      description: "Gamified learning with badges, certificates, and rewards to keep you motivated and engaged throughout your journey.",
      color: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-50 to-yellow-50"
    }
  ];

  return (
    <section className={`${isDark ? 'bg-dark':'bg-white'}  key-features-section`} ref={ref}>
      <div className="key-features-container">
        <motion.div
          className="key-features-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          {/* <h2 className="key-features-title">Key Features</h2> */}
          <Title
            text="Key Features"
            gradient="primary"
            className="text-center mb-6"
          />
          <p className="key-features-subtitle">
            Discover the powerful tools and capabilities that make our AI learning platform the ultimate choice for programming education
          </p>
        </motion.div>

        <motion.div
          className="key-features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="key-feature-card"
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`key-feature-icon bg-gradient-to-r ${feature.color} text-white`}>
                {feature.icon}
              </div>
              <div className="key-feature-content">
                <h3 className="key-feature-title">{feature.title}</h3>
                <p className="key-feature-description">{feature.description}</p>
              </div>
              <div className={`key-feature-bg bg-gradient-to-br ${feature.bgColor}`} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="key-features-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="cta-content">
            <h3 className="cta-title">Ready to Transform Your Learning?</h3>
            <p className="cta-description">
              Join thousands of learners who have already accelerated their programming skills with our AI-powered platform
            </p>
            <div className="cta-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Programming Topics</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection; 