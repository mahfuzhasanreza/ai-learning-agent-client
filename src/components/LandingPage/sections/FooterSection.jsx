import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube, 
  FaDiscord,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';

const FooterSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "#api" },
      { name: "Integrations", href: "#integrations" },
      { name: "Roadmap", href: "#roadmap" }
    ],
    learning: [
      { name: "Programming Languages", href: "#languages" },
      { name: "Web Development", href: "#web-dev" },
      { name: "Data Science", href: "#data-science" },
      { name: "Machine Learning", href: "#ml" },
      { name: "Mobile Development", href: "#mobile" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Press", href: "#press" },
      { name: "Partners", href: "#partners" }
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Support", href: "#contact" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" },
      { name: "Feedback", href: "#feedback" }
    ]
  };

  const socialLinks = [
    { icon: <FaGithub />, href: "#", label: "GitHub" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" },
    { icon: <FaDiscord />, href: "#", label: "Discord" }
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
    <footer className="footer-section" ref={ref}>
      <div className="footer-container">
        <motion.div
          className="footer-main"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
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
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
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

          <motion.div className="footer-links" variants={itemVariants}>
            <div className="footer-column">
              <h4 className="footer-column-title">Product</h4>
              <ul className="footer-link-list">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Learning</h4>
              <ul className="footer-link-list">
                {footerLinks.learning.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-link-list">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Support</h4>
              <ul className="footer-link-list">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

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

        <motion.div
          className="footer-contact"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-details">
                <h5>Email</h5>
                <p>hello@ailearningagent.com</p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div className="contact-details">
                <h5>Phone</h5>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-details">
                <h5>Address</h5>
                <p>123 Innovation Drive<br />San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>
                © 2024 AI Learning Agent. All rights reserved. Made with{' '}
                <FaHeart className="heart-icon" /> for developers worldwide.
              </p>
            </div>
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