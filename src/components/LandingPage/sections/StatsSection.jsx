import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaRobot, FaClipboardList, FaChartLine, FaUsers, FaQuestionCircle, FaGraduationCap } from "react-icons/fa";

const StatsSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [counts, setCounts] = useState({
    agents: 0,
    plans: 0,
    accuracy: 0,
    students: 0,
    quizzes: 0,
    improvement: 0
  });

  const stats = [
    {
      icon: <FaRobot />,
      number: 25,
      label: "Specialized AI Agents",
      suffix: "+",
      color: "blue"
    },
    {
      icon: <FaClipboardList />,
      number: 5000,
      label: "Study Plans Created",
      suffix: "+",
      color: "green"
    },
    {
      icon: <FaChartLine />,
      number: 95,
      label: "Weakness Prediction Accuracy",
      suffix: "%",
      color: "purple"
    },
    {
      icon: <FaUsers />,
      number: 15000,
      label: "Active Students",
      suffix: "+",
      color: "orange"
    },
    {
      icon: <FaGraduationCap />,
      number: 87,
      label: "Average Performance Improvement",
      suffix: "%",
      color: "yellow"
    }
  ];

  useEffect(() => {
    if (inView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const timer = setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = {};
          stats.forEach((stat, index) => {
            const key = Object.keys(prevCounts)[index];
            const target = stat.number;
            const current = prevCounts[key];
            const increment = target / steps;
            
            if (current < target) {
              newCounts[key] = Math.min(current + increment, target);
            } else {
              newCounts[key] = target;
            }
          });
          return newCounts;
        });
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [inView]);

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

  const getColorClass = (color) => {
    const colorMap = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      orange: "text-orange-400",
      red: "text-red-400",
      yellow: "text-yellow-400"
    };
    return colorMap[color] || "text-blue-400";
  };

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        <motion.div
          className="stats-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="stats-title">Platform Impact & Success Metrics</h2>
          <p className="stats-subtitle">
            See how our AI-powered learning platform is transforming programming education
          </p>
        </motion.div>

        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={cardVariants}
              whileHover={{
                y: -5,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className={`stat-icon ${getColorClass(stat.color)}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-number">
                  {counts[Object.keys(counts)[index]]?.toFixed(stat.number % 1 === 0 ? 0 : 1) || 0}
                  {stat.suffix}
                </h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="stats-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="stats-cta">
            Ready to join thousands of successful learners and transform your programming skills?
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection; 