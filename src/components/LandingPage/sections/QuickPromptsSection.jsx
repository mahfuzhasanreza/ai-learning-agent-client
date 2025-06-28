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
      title: "Analyze My Weaknesses",
      description: "Get a comprehensive analysis of your learning gaps and receive personalized improvement suggestions",
      icon: assets.compass_icon,
      prompt: "Analyze my current programming knowledge and identify my weak areas. Suggest specific topics and resources to improve.",
      category: "Analysis"
    },
    {
      title: "Create Study Plan",
      description: "Generate a personalized study plan with daily tasks and milestones based on your goals",
      icon: assets.bulb_icon,
      prompt: "Create a detailed study plan for learning programming. Include daily tasks, milestones, and recommended resources.",
      category: "Planning"
    },
    {
      title: "Topic-Specific AI Agent",
      description: "Get specialized help from AI agents focused on specific programming topics",
      icon: assets.message_icon,
      prompt: "I need help with data structures and algorithms. Can you act as a specialized AI agent for this topic?",
      category: "AI Agent"
    },
    {
      title: "Performance Tracking",
      description: "Track your course performance and get insights on how to improve your CT and exam scores",
      icon: assets.code_icon,
      prompt: "Help me track my programming course performance. How can I improve my CT and exam scores?",
      category: "Tracking"
    },
    {
      title: "Custom Learning Path",
      description: "Design a personalized learning journey tailored to your experience and goals",
      icon: assets.compass_icon,
      prompt: "Create a customized learning path for becoming a full-stack developer. Consider my current knowledge level.",
      category: "Path"
    },
    {
      title: "Practice Quiz",
      description: "Take interactive quizzes to test your knowledge and reinforce learning concepts",
      icon: assets.bulb_icon,
      prompt: "Generate a practice quiz on JavaScript fundamentals. Include questions of varying difficulty levels.",
      category: "Quiz"
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
          <h2 className="quick-prompts-title">Start Your Learning Journey</h2>
          <p className="quick-prompts-subtitle">
            Choose from our AI-powered learning tools designed to accelerate your programming skills
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
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickPromptsSection; 