import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../context/Context';
import { assets } from '../../../assets/assets';

const QuickPromptsSection = () => {
  const { onSent } = useContext(Context);
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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

  const quickPrompts = [
    {
      title: "What is C Programming?",
      description: "Learn the fundamentals of C programming language",
      icon: assets.compass_icon,
      prompt: "What is C Programming?",
      category: "Basics"
    },
    {
      title: "How to Learn Programming?",
      description: "Get started with programming as a beginner",
      icon: assets.bulb_icon,
      prompt: "How can I learn C Programme?",
      category: "Getting Started"
    },
    {
      title: "Advanced C Concepts",
      description: "Master functions, structures, and pointers",
      icon: assets.message_icon,
      prompt: "Give me the details about C Programming including functions, structures, pointers etc",
      category: "Advanced"
    },
    {
      title: "Programming Roadmap",
      description: "Find the best path to become a programmer",
      icon: assets.code_icon,
      prompt: "As a beginner how can I learn programming? Which language should I learn first?",
      category: "Career"
    }
  ];

  const handleCardClick = (prompt) => {
    onSent(prompt);
    navigate('/chat'); // Navigate to the main chat interface
  };

  return (
    <section className="quick-prompts-section" ref={ref}>
      <div className="quick-prompts-container">
        <motion.div
          className="quick-prompts-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="quick-prompts-title">Quick Start Prompts</h2>
          <p className="quick-prompts-subtitle">
            Jump right into learning with these popular programming topics
          </p>
        </motion.div>

        <motion.div
          className="quick-prompts-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {quickPrompts.map((prompt, index) => (
            <motion.div
              key={index}
              className="quick-prompt-card"
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(prompt.prompt)}
            >
              <div className="prompt-card-content">
                <div className="prompt-card-header">
                  <span className="prompt-category">{prompt.category}</span>
                  <div className="prompt-icon">
                    <img src={prompt.icon} alt="" />
                  </div>
                </div>
                <h3 className="prompt-title">{prompt.title}</h3>
                <p className="prompt-description">{prompt.description}</p>
                <div className="prompt-action">
                  <span className="prompt-action-text">Start Learning</span>
                  <svg className="prompt-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="quick-prompts-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button 
            className="explore-more-btn"
            onClick={() => navigate('/chat')}
          >
            Explore More Topics
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickPromptsSection; 