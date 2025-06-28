import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBrain, FaCode, FaGraduationCap, FaUsers, FaLightbulb, FaShieldAlt } from "react-icons/fa";

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
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

  const cardVariants = {
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
      icon: <FaBrain />,
      title: "AI-Powered Learning",
      description: "Advanced machine learning algorithms adapt to your learning style and pace",
      color: "blue"
    },
    {
      icon: <FaCode />,
      title: "Interactive Coding",
      description: "Real-time code execution with instant feedback and debugging assistance",
      color: "green"
    },
    {
      icon: <FaGraduationCap />,
      title: "Structured Curriculum",
      description: "Comprehensive learning paths designed by programming experts",
      color: "purple"
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      description: "Connect with learners worldwide and share knowledge and experiences",
      color: "orange"
    },
    {
      icon: <FaLightbulb />,
      title: "Smart Suggestions",
      description: "Get personalized recommendations based on your progress and interests",
      color: "yellow"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Learning",
      description: "Your data and progress are protected with enterprise-grade security",
      color: "red"
    }
  ];

  const getColorClass = (color) => {
    const colorMap = {
      blue: "text-blue-500 bg-blue-50",
      green: "text-green-500 bg-green-50",
      purple: "text-purple-500 bg-purple-50",
      orange: "text-orange-500 bg-orange-50",
      yellow: "text-yellow-500 bg-yellow-50",
      red: "text-red-500 bg-red-50"
    };
    return colorMap[color] || "text-blue-500 bg-blue-50";
  };

  return (
    <section className="features-section" ref={ref}>
      <div className="features-container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="features-title">Why Choose AIDA?</h2>
          <p className="features-subtitle">
            Experience the future of programming education with our cutting-edge features
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`feature-icon ${getColorClass(feature.color)}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 