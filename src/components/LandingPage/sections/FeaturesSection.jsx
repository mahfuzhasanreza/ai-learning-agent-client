import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRobot, FaChartLine, FaClipboardList, FaRoute, FaGraduationCap, FaQuestionCircle, FaUsers, FaLightbulb, FaShieldAlt } from "react-icons/fa";

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
      icon: <FaRobot />,
      title: "Topic-wise AI Agents",
      description: "Specialized AI agents for each programming topic - from basic syntax to advanced algorithms, providing targeted assistance and explanations",
      color: "blue"
    },
    {
      icon: <FaChartLine />,
      title: "Weakness Prediction",
      description: "Advanced analytics identify your learning gaps and suggest specific study groups and resources to strengthen your weak areas",
      color: "green"
    },
    {
      icon: <FaClipboardList />,
      title: "Smart Study Plans",
      description: "AI-generated personalized study plans with daily tasks, progress tracking, and adaptive scheduling based on your learning pace",
      color: "purple"
    },
    {
      icon: <FaRoute />,
      title: "Customized Learning Paths",
      description: "Tailored learning journeys designed around your goals, experience level, and preferred learning style for maximum efficiency",
      color: "orange"
    },
    {
      icon: <FaGraduationCap />,
      title: "Course Performance Tracking",
      description: "Comprehensive tracking of your CT and exam marks for individual courses with detailed analytics and improvement suggestions",
      color: "red"
    },
    {
      icon: <FaQuestionCircle />,
      title: "Interactive Quizzes",
      description: "Dynamic quizzes that adapt to your skill level, providing instant feedback and reinforcing concepts through practice",
      color: "yellow"
    },
    {
      icon: <FaUsers />,
      title: "Group Learning",
      description: "Connect with peers who share similar learning goals and weaknesses for collaborative study sessions and peer support",
      color: "indigo"
    },
    {
      icon: <FaLightbulb />,
      title: "Intelligent Recommendations",
      description: "Get personalized recommendations for study materials, practice problems, and learning resources based on your performance",
      color: "pink"
    },
    {
      icon: <FaShieldAlt />,
      title: "Progress Security",
      description: "Your learning data and progress are securely stored and protected with enterprise-grade security measures",
      color: "teal"
    }
  ];

  const getColorClass = (color) => {
    const colorMap = {
      blue: "text-blue-500 bg-blue-50",
      green: "text-green-500 bg-green-50",
      purple: "text-purple-500 bg-purple-50",
      orange: "text-orange-500 bg-orange-50",
      red: "text-red-500 bg-red-50",
      yellow: "text-yellow-500 bg-yellow-50",
      indigo: "text-indigo-500 bg-indigo-50",
      pink: "text-pink-500 bg-pink-50",
      teal: "text-teal-500 bg-teal-50"
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
          <h2 className="features-title">Revolutionary Learning Features</h2>
          <p className="features-subtitle">
            Experience a complete learning ecosystem designed to maximize your programming potential
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