import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaCheckCircle, 
  FaStar, 
  FaUserGraduate, 
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaClock,
  FaGlobe
} from 'react-icons/fa';
import Title from '../../shared/Title';
import { Context } from '../../../context/Context';

const WhyChooseUsSection = () => {

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const reasons = [
    {
      icon: <FaRocket className="text-3xl" />,
      title: "Accelerated Learning",
      description: "Our AI-powered platform helps you learn 3x faster than traditional methods with personalized learning paths.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption ensures your data and progress are always protected.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 AI Support",
      description: "Get instant help anytime with our intelligent AI assistant that never sleeps or takes breaks.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to all resources and adaptive scheduling.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "Global Community",
      description: "Connect with learners from around the world and share knowledge across cultures.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FaUserGraduate className="text-3xl" />,
      title: "Expert-Led Content",
      description: "All content is curated and verified by industry experts and experienced educators.",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "This platform transformed my learning experience. The AI guidance helped me master complex concepts in weeks instead of months.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      company: "Microsoft",
      content: "The personalized learning paths and real-time feedback made all the difference. I've never learned programming this efficiently.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Data Scientist",
      company: "Amazon",
      content: "The collaborative features and expert community support accelerated my career transition into tech significantly.",
      rating: 5,
      avatar: "EW"
    }
  ];

  const comparisonData = [
    {
      feature: "Learning Speed",
      traditional: "6-12 months",
      ourPlatform: "2-4 months",
      advantage: "3x faster"
    },
    {
      feature: "Success Rate",
      traditional: "60%",
      ourPlatform: "95%",
      advantage: "35% higher"
    },
    {
      feature: "Support Availability",
      traditional: "Limited hours",
      ourPlatform: "24/7 AI support",
      advantage: "Always available"
    },
    {
      feature: "Personalization",
      traditional: "One-size-fits-all",
      ourPlatform: "AI-adaptive",
      advantage: "Tailored experience"
    }
  ];

  return (
    <section className={`why-choose-us-section ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} ref={ref}>
      <div className="why-choose-us-container">
        <motion.div
          className={`why-choose-us-header ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          {/* <h2 className="why-choose-us-title">Why Choose Us?</h2> */}
          
          <Title
            text="Why Choose Us?"
            gradient="primary"
            className="text-center mb-6"
          />
          
          <p className="why-choose-us-subtitle">
            Discover what makes our AI learning platform the preferred choice for thousands of successful developers worldwide
          </p>
        </motion.div>

        <motion.div
          className="why-choose-us-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className={`why-choose-us-card ${isDark ? 'bg-gray-800 text-white shadow-lg':'bg-white text-gray-900 shadow-md'}`}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <div className={`why-choose-us-icon bg-gradient-to-r ${reason.color} text-white`}>
                {reason.icon}
              </div>
              <div className="why-choose-us-content">
                <h3 className="why-choose-us-card-title">{reason.title}</h3>
                <p className="why-choose-us-card-description">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
{/* 
        <motion.div
          className="testimonials-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h3 className="testimonials-title">What Our Learners Say</h3>
          
         
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* <motion.div
          className="comparison-section"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h3 className="comparison-title">Traditional vs Our Platform</h3>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-cell">Feature</div>
              <div className="comparison-cell">Traditional Learning</div>
              <div className="comparison-cell">Our Platform</div>
              <div className="comparison-cell">Advantage</div>
            </div>
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                className="comparison-row"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              >
                <div className="comparison-cell feature-cell">
                  <FaCheckCircle className="check-icon" />
                  {item.feature}
                </div>
                <div className="comparison-cell traditional-cell">{item.traditional}</div>
                <div className="comparison-cell platform-cell">{item.ourPlatform}</div>
                <div className="comparison-cell advantage-cell">{item.advantage}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default WhyChooseUsSection; 