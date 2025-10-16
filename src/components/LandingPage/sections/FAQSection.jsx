import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import Title from '../../shared/Title';
import { Context } from '../../../context/Context';

const FAQSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const {isDark} = useContext(Context);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the AI-powered learning work?",
      answer: "Our AI analyzes your learning patterns, strengths, and weaknesses to create personalized learning paths. It adapts content difficulty, suggests relevant resources, and provides real-time feedback to optimize your learning experience."
    },
    {
      question: "What programming languages and topics are covered?",
      answer: "We cover 50+ programming topics including Python, JavaScript, Java, C++, React, Node.js, Machine Learning, Data Science, Web Development, Mobile Development, and more. New topics are added regularly based on industry trends."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 7-day free trial with full access to all features. No credit card required. You can explore our platform, complete lessons, and experience the AI-powered learning before deciding to subscribe."
    },
    {
      question: "How long does it take to complete a course?",
      answer: "Course completion time varies based on your experience level and learning pace. Beginners typically complete courses in 2-4 months, while experienced developers can finish in 1-2 months. Our AI adapts the pace to your schedule."
    },
    {
      question: "Can I learn at my own pace?",
      answer: "Absolutely! Our platform is designed for self-paced learning. You have 24/7 access to all content, and the AI adjusts to your schedule. You can pause, resume, and review content as many times as needed."
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className={`faq-section ${isDark ? 'bg-gray-900' : 'bg-white'}`} ref={ref}>
      <div className="faq-container">
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="faq-icon">
            <FaQuestionCircle />
          </div>
          {/* <h2 className="faq-title">Frequently Asked Questions</h2> */}

            <Title
            text="Frequently Asked Questions"
            gradient="primary"
            className="text-center mb-6"
          />

          <p className="faq-subtitle">
            Find answers to common questions about our AI learning platform
          </p>
        </motion.div>

        <motion.div
          className="faq-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq-item ${isDark ? 'bg-gray-800 text-white':'bg-white text-gray-900'}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="faq-question-text">{faq.question}</h3>
                <motion.div
                  className="faq-chevron"
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown />
                </motion.div>
              </div>
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="faq-answer-text">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={`faq-cta ${isDark ? 'bg-dark text-white':'bg-white text-gray-900'} `}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h3 className="faq-cta-title">Still Have Questions?</h3>
          <p className="faq-cta-description">
            Our support team is here to help you get started and make the most of your learning journey
          </p>
          <div className="faq-cta-buttons">
            <button className={`faq-contact-btn btn-bg-primary`}>
              Contact Support
            </button>
            <button className="faq-demo-btn">
              Request Demo
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection; 