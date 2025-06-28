import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaRobot, FaChartLine, FaClipboardList, FaRoute, FaGraduationCap, FaQuestionCircle, FaPlay, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import HeroLottie from '../../../lottie/hero-lottie.json'
import Lottie from 'lottie-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typewriterWords = ['Intelligently', 'Strategically'];
  const typeSpeed = 150;
  const deleteSpeed = 100;
  const pauseTime = 1000;

  // Typewriter effect
  React.useEffect(() => {
    const currentWord = typewriterWords[currentIndex];
    
    if (!isDeleting) {
      if (typewriterText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typewriterText.length > 0) {
        const timeout = setTimeout(() => {
          setTypewriterText(typewriterText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % typewriterWords.length);
      }
    }
  }, [typewriterText, currentIndex, isDeleting, typewriterWords]);

  const slides = [
    // {
    //   title: "Master Programming",
    //   subtitle: "With AI-Powered Personalized Learning",
    //   description: "Experience the future of education with topic-specific AI agents, intelligent weakness prediction, and personalized study plans",
    //   features: ["Topic-wise AI Agents", "Weakness Prediction", "Smart Study Plans"],
    //   // gradient: "from-blue-600 via-purple-600 to-pink-600",
    //   gradient: "from-green-600 via-teal-600 to-cyan-600",
    //   icon: <FaRobot className="text-5xl" />,
    //   bgImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    //   lottieUrl: HeroLottie
    // },
    // {
    //   title: "Adaptive Learning",
    //   subtitle: "That Grows With You",
    //   description: "Our AI continuously adapts to your learning style, pace, and progress to ensure optimal knowledge retention",
    //   features: ["Customized Learning Paths", "Real-time Adjustments", "Performance Tracking"],
    //   gradient: "from-green-600 via-teal-600 to-cyan-600",
    //   icon: <FaChartLine className="text-5xl" />,
    //   bgImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //   lottieUrl: HeroLottie
    // },
    {
      title: "Collaborative Success",
      subtitle: "With AI-Powered Personalized Learning",
      description: "Join AI-moderated study groups and connect with peers who share your learning goals and challenges",
      features: ["Study Groups", "Peer Support", "Shared Insights"],
      gradient: "from-green-600 via-teal-600 to-cyan-600",
      icon: <FaGraduationCap className="text-5xl" />,
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      lottieUrl: HeroLottie
    }
  ];

  // Auto-play functionality
  // useEffect(() => {
  //   if (!isAutoPlaying) return;

  //   const interval = setInterval(() => {
  //     setDirection(-1);
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   }, 3500);

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 15 : -15
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
        opacity: { duration: 0.6, delay: 0.2 },
        scale: { duration: 0.6, delay: 0.1 },
        rotateY: { duration: 0.6, delay: 0.1 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
        rotateY: { duration: 0.4 }
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const backgroundVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: {
      opacity: 0.2,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <section className="hero-section relative overflow-hidden min-h-screen w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Carousel Container - Full Width */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full flex items-center justify-center relative"
            style={{ perspective: '1000px' }}
          >
            {/* Background Image for Current Slide */}
            <AnimatePresence mode="wait">
              <div
                key={`bg-${currentSlide}`}
                variants={backgroundVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slides[currentSlide].bgImage})`,
                  filter: 'blur(2px) brightness(0.3)'
                }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-30 transition-all duration-1000 ease-in-out`} />

            <div className="w-full mx-38 px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                {/* Left Content */}
                <div
                  className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  key={`content-${currentSlide}`}
                >
                  {/* Title */}
                  <h1
                    className="mb-6 w-full"
                    variants={textVariants}
                  >
                    <span className="hero-title-main block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 leading-tight">
                      
                      <span>Learn </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                        {typewriterText}
                      </span>
                      <span className="inline-block w-1 h-12 bg-cyan-400 ml-1 animate-pulse"></span>
                      {/* <div>With COSMOS-ITS</div> */}
                    </span>
                    <span className="hero-title-sub block text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-blue-200 leading-relaxed">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p
                    className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 lg:mb-10 leading-relaxed"
                    variants={textVariants}
                  >
                    {slides[currentSlide].description}
                  </p>

                  {/* Features */}
                  {/* <div
                    className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 lg:mb-10"
                    variants={textVariants}
                  >
                    {slides[currentSlide].features.map((feature, index) => (
                      <div
                        key={feature}
                        custom={index}
                        variants={featureVariants}
                        className="hero-feature bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <span className="hero-feature-text text-white font-medium text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div> */}

                  {/* CTA Buttons */}
                  <div
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    variants={textVariants}
                  >
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlay className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Start Learning Now
                    </button>
                    <button
                      className="border-2 border-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Right Visual Element - Lottie Animation */}
                <div
                  className="flex-1 flex justify-center lg:justify-end"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  key={`visual-${currentSlide}`}
                >
                  <div className="relative">
                    {/* Lottie Animation Container */}
                    <div
                      className="w-80 h-80 lg:w-96 lg:h-96 relative"
                      variants={textVariants}
                    >
                      {/* <iframe
                        src={slides[currentSlide].lottieUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title={`${slides[currentSlide].title} Animation`}
                      /> */}

                      <Lottie animationData={slides[currentSlide].lottieUrl} loop={true} />
                    </div>

                    {/* Fallback Gradient Orb */}
                    <div
                      className={`absolute inset-0 w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r ${slides[currentSlide].gradient} opacity-20 blur-3xl animate-pulse`}
                      variants={textVariants}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {/* <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 z-20"
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FaArrowLeft />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 z-20"
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FaArrowRight />
        </button> */}

        {/* Slide Indicators */}
        {/* <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
                }`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div> */}

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 