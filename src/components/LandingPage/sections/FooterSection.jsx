import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube, 
  FaDiscord,
  FaArrowRight
} from 'react-icons/fa';

const FooterSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Performance Tracking", href: "/performance-tracking" },
    { name: "Study Plan", href: "/study-plan" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Chatbot", href: "/cosmos-chatbot" }
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com/mahfuzhasanreza", label: "GitHub" },
    { icon: <FaTwitter />, href: "https://twitter.com/mahfuzhasanreza", label: "Twitter" },
    { icon: <FaLinkedin />, href: "https://linkedin.com/in/mahfuzhasanreza", label: "LinkedIn" },
    { icon: <FaYoutube />, href: "https://youtube.com/@LearnWithMahfuz", label: "YouTube" },
    { icon: <FaDiscord />, href: "https://discord.com", label: "Discord" }
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
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="footer-section" ref={ref}>
      <div className="footer-container">

        <motion.div
          className="footer-main"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >

          {/* BRAND + SOCIAL */}
          <motion.div className="footer-brand" variants={itemVariants}>
            <div className="footer-logo">
              <h3 className="footer-logo-text">AI Learning Agent</h3>
              <p className="footer-tagline">
                Empowering developers with AI-powered learning experiences
              </p>
            </div>

            <div className="footer-social">
              <h4 className="social-title">Follow Us</h4>
              <div className="social-links">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className="social-link"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div className="ml-70 w-full footer-links" variants={itemVariants}>
            <div className="footer-column">
              <h4 className="footer-column-title">Quick Links</h4>
              <ul className="footer-link-list">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div className="footer-newsletter" variants={itemVariants}>
            <h4 className="newsletter-title">Stay Updated</h4>
            <p className="newsletter-description">
              Get the latest updates on new features, learning resources, and community events
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <motion.button
                className="newsletter-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowRight />
              </motion.button>
            </div>
            <p className="newsletter-privacy">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>

        </motion.div>

        {/* BOTTOM SECTION */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="footer-bottom-content">
            <p>© 2025 COSMOS-ITS. All rights reserved.</p>

            <div className="footer-legal">
              <a href="#privacy" className="legal-link">Privacy Policy</a>
              <a href="#terms" className="legal-link">Terms of Service</a>
              <a href="#cookies" className="legal-link">Cookie Policy</a>
            </div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default FooterSection;
