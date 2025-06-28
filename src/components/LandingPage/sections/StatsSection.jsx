import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaChartLine, FaRocket, FaShieldAlt, FaUsers, FaCode, FaGraduationCap } from "react-icons/fa";

const StatsSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [counts, setCounts] = useState({
    learners: 0,
    languages: 0,
    uptime: 0,
    courses: 0,
    countries: 0,
    satisfaction: 0
  });

  const stats = [
    {
      icon: <FaUsers />,
      number: 10000,
      label: "Active Learners",
      suffix: "+",
      color: "blue"
    },
    {
      icon: <FaCode />,
      number: 50,
      label: "Programming Languages",
      suffix: "+",
      color: "green"
    },
    {
      icon: <FaShieldAlt />,
      number: 99.9,
      label: "Uptime",
      suffix: "%",
      color: "purple"
    },
    {
      icon: <FaGraduationCap />,
      number: 200,
      label: "Expert Courses",
      suffix: "+",
      color: "orange"
    },
    {
      icon: <FaChartLine />,
      number: 150,
      label: "Countries",
      suffix: "+",
      color: "red"
    },
    {
      icon: <FaRocket />,
      number: 98,
      label: "Satisfaction Rate",
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
          <h2 className="stats-title">Our Impact in Numbers</h2>
          <p className="stats-subtitle">
            Join thousands of learners who have transformed their careers with AIDA
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
            Ready to join our growing community of learners?
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection; 