import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRocket, FaBrain, FaCode, FaGraduationCap } from "react-icons/fa";

const HeroSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    { icon: <FaBrain />, text: "AI-Powered Learning" },
    { icon: <FaCode />, text: "Interactive Coding" },
    { icon: <FaGraduationCap />, text: "Expert Curriculum" },
    { icon: <FaRocket />, text: "Fast Progress" }
  ];

  return (
    <section className="hero-section" ref={ref}>
      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="hero-content" variants={itemVariants}>
          <motion.h1 
            className="hero-title"
            variants={itemVariants}
          >
            <span className="hero-title-main">Hello, User.</span>
            <span className="hero-title-sub">How can I help you today?</span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            variants={itemVariants}
          >
            Your AI-powered learning companion for mastering programming
          </motion.p>

          <motion.div 
            className="hero-features"
            variants={itemVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="hero-feature"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="hero-feature-icon">
                  {feature.icon}
                </div>
                <span className="hero-feature-text">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 